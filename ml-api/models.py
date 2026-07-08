import numpy as np
import pandas as pd
import xgboost as xgb
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
    X = df.drop(columns=['target']).values
    y = df['target'].values
    return X, y

def train_and_predict_xgb(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = xgb.XGBRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    
    last_features = [prices[-1]] + [prices[-i] for i in range(1, 6)]
    pred = model.predict(np.array([last_features]))[0]
    return float(pred)

def train_and_predict_cat(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = CatBoostRegressor(iterations=30, depth=3, learning_rate=0.1, verbose=0)
    model.fit(X, y)
    
    last_features = [prices[-1]] + [prices[-i] for i in range(1, 6)]
    pred = model.predict(np.array([last_features]))[0]
    return float(pred)

def train_and_predict_rf(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = RandomForestRegressor(n_estimators=30, max_depth=3)
    model.fit(X, y)
    
    last_features = [prices[-1]] + [prices[-i] for i in range(1, 6)]
    pred = model.predict(np.array([last_features]))[0]
    return float(pred)

def train_and_predict_gb(prices, horizon):
    X, y = prepare_data(prices, horizon)
    if len(X) < 10: return prices[-1]
    model = GradientBoostingRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    
    last_features = [prices[-1]] + [prices[-i] for i in range(1, 6)]
    pred = model.predict(np.array([last_features]))[0]
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
    
    last_features = [prices[-1]] + [prices[-i] for i in range(1, 6)]
    last_scaled = scaler_x.transform(np.array([last_features]))
    pred_scaled = model.predict(last_scaled)
    
    pred = scaler_y.inverse_transform(pred_scaled.reshape(-1, 1))[0][0]
    return float(pred)


def run_all_models(prices, horizons=[5, 20, 60, 120]):
    results = {}
    for h in horizons:
        results[str(h)] = {
            'XGBoost': train_and_predict_xgb(prices, h),
            'CatBoost': train_and_predict_cat(prices, h),
            'RandomForest': train_and_predict_rf(prices, h),
            'GradientBoosting': train_and_predict_gb(prices, h),
            'SVR': train_and_predict_svr(prices, h)
        }
    return results
