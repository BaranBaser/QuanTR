import numpy as np
import pandas as pd
import gc
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
import warnings
warnings.filterwarnings('ignore')


def prepare_data(prices, horizon):
    df = pd.DataFrame({'close': prices})
    df['target'] = df['close'].shift(-horizon)
    for i in range(1, 6):
        df[f'lag_{i}'] = df['close'].shift(i)
    
    df.dropna(inplace=True)
    
    for col in df.select_dtypes(include=['float64']).columns:
        df[col] = df[col].astype(np.float32)
    
    X = df.drop(columns=['target']).values.astype(np.float32)
    y = df['target'].values.astype(np.float32)
    return X, y

def train_and_predict_xgb(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = xgb.XGBRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    last_features = np.array([[prices[-1]] + [prices[-i] for i in range(1, 6)]], dtype=np.float32)
    pred = model.predict(last_features)[0]
    del model, X, y
    gc.collect()
    return float(pred)

def train_and_predict_lgb(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = lgb.LGBMRegressor(n_estimators=30, max_depth=3, learning_rate=0.1, verbose=-1)
    model.fit(X, y)
    last_features = np.array([[prices[-1]] + [prices[-i] for i in range(1, 6)]], dtype=np.float32)
    pred = model.predict(last_features)[0]
    del model, X, y
    gc.collect()
    return float(pred)

def train_and_predict_cat(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = CatBoostRegressor(iterations=30, depth=3, learning_rate=0.1, verbose=0)
    model.fit(X, y)
    last_features = np.array([[prices[-1]] + [prices[-i] for i in range(1, 6)]], dtype=np.float32)
    pred = model.predict(last_features)[0]
    del model, X, y
    gc.collect()
    return float(pred)

def train_and_predict_rf(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = RandomForestRegressor(n_estimators=30, max_depth=3)
    model.fit(X, y)
    last_features = np.array([[prices[-1]] + [prices[-i] for i in range(1, 6)]], dtype=np.float32)
    pred = model.predict(last_features)[0]
    del model, X, y
    gc.collect()
    return float(pred)

def train_and_predict_gb(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = GradientBoostingRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    last_features = np.array([[prices[-1]] + [prices[-i] for i in range(1, 6)]], dtype=np.float32)
    pred = model.predict(last_features)[0]
    del model, X, y
    gc.collect()
    return float(pred)

def train_and_predict_svr(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    
    scaler_x = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    X_scaled = scaler_x.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()
    
    model = SVR(kernel='rbf', C=100, gamma='auto', epsilon=0.1)
    model.fit(X_scaled, y_scaled)
    
    last_features = np.array([[prices[-1]] + [prices[-i] for i in range(1, 6)]], dtype=np.float32)
    last_scaled = scaler_x.transform(last_features)
    pred_scaled = model.predict(last_scaled)
    pred = scaler_y.inverse_transform(pred_scaled.reshape(-1, 1))[0][0]
    
    del model, X, y, scaler_x, scaler_y
    gc.collect()
    return float(pred)


def run_all_models(prices, horizons=[5, 20, 60, 120]):
    results = {}
    for h in horizons:
        results[str(h)] = {
            'XGBoost': train_and_predict_xgb(prices, h),
            'LightGBM': train_and_predict_lgb(prices, h),
            'CatBoost': train_and_predict_cat(prices, h),
            'RandomForest': train_and_predict_rf(prices, h),
            'GradientBoosting': train_and_predict_gb(prices, h),
            'SVR': train_and_predict_svr(prices, h)
        }
    gc.collect()
    return results
