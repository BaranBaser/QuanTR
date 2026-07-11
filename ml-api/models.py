import numpy as np
import pandas as pd
import gc
import xgboost as xgb
import lightgbm as lgb
try:
    from catboost import CatBoostRegressor
    HAS_CATBOOST = True
except ImportError:
    HAS_CATBOOST = False
from sklearn.linear_model import Ridge, Lasso
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.model_selection import TimeSeriesSplit
import warnings
warnings.filterwarnings('ignore')


def prepare_data(data, horizon):
    """OHLCV verisinden feature matrix ve target üretir.
    
    Girdi: data = [{"open": float, "high": float, "low": float, "close": float, "volume": float}, ...]
    
    Features (t anında bilinen veriler):
      - OHLCV raw değerleri
      - daily_return: günlük getiri
      - lag_close_1..10: kapanış fiyatının gecikmeli değerleri
      - sma_5, sma_10, sma_20: basit hareketli ortalamalar
      - volatility_5, volatility_20: volatilite (rolling std)
      - volume_change: hacim değişimi
      - high_low_range: günlük fiyat aralığı
      - momentum_5, momentum_10: fiyat momentumu
      - rsi_14: göreceli güç endeksi
    
    Target (t+horizon):
      - close[t+horizon] — gelecekteki kapanış fiyatı
    """
    df = pd.DataFrame(data)

    # Feature mühendisliği
    df['daily_return'] = df['close'].pct_change()

    for i in range(1, 11):
        df[f'lag_close_{i}'] = df['close'].shift(i)

    df['sma_5'] = df['close'].rolling(5).mean()
    df['sma_10'] = df['close'].rolling(10).mean()
    df['sma_20'] = df['close'].rolling(20).mean()

    df['volatility_5'] = df['close'].rolling(5).std()
    df['volatility_20'] = df['close'].rolling(20).std()

    df['volume_change'] = df['volume'].pct_change()

    df['high_low_range'] = (df['high'] - df['low']) / (df['close'] + 1e-8)

    df['momentum_5'] = df['close'] / (df['close'].shift(5) + 1e-8) - 1
    df['momentum_10'] = df['close'] / (df['close'].shift(10) + 1e-8) - 1

    # RSI 14
    delta = df['close'].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()
    rs = gain / (loss + 1e-8)
    df['rsi_14'] = 100 - (100 / (1 + rs))

    # Target: t+horizon'daki close fiyatı
    df['target'] = df['close'].shift(-horizon)

    df.dropna(inplace=True)
    df.replace([np.inf, -np.inf], 0, inplace=True)

    feature_cols = [c for c in df.columns if c != 'target']

    for col in feature_cols:
        if df[col].dtype == np.float64:
            df[col] = df[col].astype(np.float32)

    X = df[feature_cols].values.astype(np.float32)
    y = df['target'].values.astype(np.float32)
    return X, y, feature_cols


def evaluate_model(model_fn, X, y, n_splits=5):
    """TimeSeriesSplit ile temporal cross-validation yapar.
    Returns: (mean_mape, std_mape)
    """
    if len(X) < n_splits * 2:
        return 50.0, 0.0

    tscv = TimeSeriesSplit(n_splits=min(n_splits, len(X) // 2))
    mape_scores = []

    for train_idx, test_idx in tscv.split(X):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        model = model_fn()
        model.fit(X_train, y_train)
        pred = model.predict(X_test)

        mape = np.mean(np.abs((y_test - pred) / (np.abs(y_test) + 1e-8))) * 100
        mape_scores.append(min(mape, 100.0))

    return float(np.mean(mape_scores)), float(np.std(mape_scores))


def _build_features_for_prediction(data, feature_cols):
    """Son bar'dan feature vektörü üretir (tahmin için)."""
    df = pd.DataFrame(data)

    df['daily_return'] = df['close'].pct_change()
    for i in range(1, 11):
        df[f'lag_close_{i}'] = df['close'].shift(i)
    df['sma_5'] = df['close'].rolling(5).mean()
    df['sma_10'] = df['close'].rolling(10).mean()
    df['sma_20'] = df['close'].rolling(20).mean()
    df['volatility_5'] = df['close'].rolling(5).std()
    df['volatility_20'] = df['close'].rolling(20).std()
    df['volume_change'] = df['volume'].pct_change()
    df['high_low_range'] = (df['high'] - df['low']) / (df['close'] + 1e-8)
    df['momentum_5'] = df['close'] / (df['close'].shift(5) + 1e-8) - 1
    df['momentum_10'] = df['close'] / (df['close'].shift(10) + 1e-8) - 1
    delta = df['close'].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()
    rs = gain / (loss + 1e-8)
    df['rsi_14'] = 100 - (100 / (1 + rs))

    df.replace([np.inf, -np.inf], 0, inplace=True)
    df.ffill(inplace=True)
    df.bfill(inplace=True)

    last_row = df.iloc[-1:]
    features = np.zeros((1, len(feature_cols)), dtype=np.float32)
    for i, col in enumerate(feature_cols):
        if col in last_row.columns:
            val = last_row[col].values[0]
            features[0, i] = float(val) if np.isfinite(val) else 0.0
    return features


# ─── Model Fonksiyonları ───────────────────────────────────────────────────

def train_and_predict_ridge(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = Ridge(alpha=1.0)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(lambda: Ridge(alpha=1.0), X, y)
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_lasso(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = Lasso(alpha=0.1, max_iter=5000)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(lambda: Lasso(alpha=0.1, max_iter=5000), X, y)
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_xgb(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = xgb.XGBRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(
        lambda: xgb.XGBRegressor(n_estimators=30, max_depth=3, learning_rate=0.1),
        X, y
    )
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_lgb(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = lgb.LGBMRegressor(n_estimators=30, max_depth=3, learning_rate=0.1, verbose=-1)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(
        lambda: lgb.LGBMRegressor(n_estimators=30, max_depth=3, learning_rate=0.1, verbose=-1),
        X, y
    )
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_cat(data, horizon):
    if not HAS_CATBOOST:
        return data[-1]['close'], 50.0
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = CatBoostRegressor(iterations=30, depth=3, learning_rate=0.1, verbose=0)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(
        lambda: CatBoostRegressor(iterations=30, depth=3, learning_rate=0.1, verbose=0),
        X, y
    )
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_rf(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = RandomForestRegressor(n_estimators=30, max_depth=3)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(
        lambda: RandomForestRegressor(n_estimators=30, max_depth=3),
        X, y
    )
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_gb(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0
    model = GradientBoostingRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    last_features = _build_features_for_prediction(data, feature_cols)
    pred = model.predict(last_features)[0]
    mape, _ = evaluate_model(
        lambda: GradientBoostingRegressor(n_estimators=30, max_depth=3, learning_rate=0.1),
        X, y
    )
    del model, X, y
    gc.collect()
    return float(pred), float(mape)

def train_and_predict_svr(data, horizon):
    X, y, feature_cols = prepare_data(data, horizon)
    if len(X) < 15: return data[-1]['close'], 50.0

    scaler_x = MinMaxScaler()
    scaler_y = MinMaxScaler()

    X_scaled = scaler_x.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()

    model = SVR(kernel='rbf', C=100, gamma='auto', epsilon=0.1)
    model.fit(X_scaled, y_scaled)

    last_features = _build_features_for_prediction(data, feature_cols)
    last_scaled = scaler_x.transform(last_features)
    pred_scaled = model.predict(last_scaled)
    pred = scaler_y.inverse_transform(pred_scaled.reshape(-1, 1))[0][0]

    mape, _ = evaluate_model(
        lambda: SVR(kernel='rbf', C=100, gamma='auto', epsilon=0.1),
        X_scaled, y_scaled
    )

    del model, X, y, scaler_x, scaler_y
    gc.collect()
    return float(pred), float(mape)


# ─── Ana Çalıştırıcı ────────────────────────────────────────────────────────

def run_all_models(data, horizons=[5, 20, 60, 120]):
    """Tüm modelleri çalıştırır.
    
    Args:
        data: List[{"open", "high", "low", "close", "volume"}]
        horizons: Tahmin edilecek gün sayıları
    
    Returns:
        {horizon: {model_name: {"prediction": float, "mape": float}}}
    """
    results = {}
    models = {
        'Ridge': train_and_predict_ridge,
        'Lasso': train_and_predict_lasso,
        'XGBoost': train_and_predict_xgb,
        'LightGBM': train_and_predict_lgb,
        'CatBoost': train_and_predict_cat,
        'RandomForest': train_and_predict_rf,
        'GradientBoosting': train_and_predict_gb,
        'SVR': train_and_predict_svr,
    }

    for h in horizons:
        results[str(h)] = {}
        for name, fn in models.items():
            try:
                pred, mape = fn(data, h)
                results[str(h)][name] = {
                    'prediction': round(pred, 4),
                    'mape': round(mape, 2)
                }
            except Exception as e:
                results[str(h)][name] = {
                    'prediction': data[-1]['close'],
                    'mape': 100.0,
                    'error': str(e)
                }
        gc.collect()

    return results
