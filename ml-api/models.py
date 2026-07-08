import numpy as np
import pandas as pd
import xgboost as xgb
from catboost import CatBoostRegressor
import torch
import torch.nn as nn
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
import warnings
warnings.filterwarnings('ignore')

class SimpleLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_layer_size=16, output_size=1):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_layer_size, batch_first=True)
        self.linear = nn.Linear(hidden_layer_size, output_size)

    def forward(self, input_seq):
        lstm_out, _ = self.lstm(input_seq)
        predictions = self.linear(lstm_out[:, -1, :])
        return predictions

class SimpleTransformer(nn.Module):
    def __init__(self, input_size=1, hidden_dim=16, nhead=2, num_layers=1):
        super().__init__()
        self.embedding = nn.Linear(input_size, hidden_dim)
        encoder_layer = nn.TransformerEncoderLayer(d_model=hidden_dim, nhead=nhead, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.linear = nn.Linear(hidden_dim, 1)

    def forward(self, x):
        x = self.embedding(x)
        out = self.transformer(x)
        out = self.linear(out[:, -1, :])
        return out

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

def train_and_predict_dl(prices, horizon, model_type='lstm'):
    seq_length = 10
    if len(prices) < seq_length + horizon:
        return prices[-1]
        
    scaler = MinMaxScaler()
    scaled_prices = scaler.fit_transform(np.array(prices).reshape(-1, 1))
    
    X, y = [], []
    for i in range(len(scaled_prices) - seq_length - horizon):
        X.append(scaled_prices[i:i+seq_length])
        y.append(scaled_prices[i+seq_length+horizon-1])
        
    if len(X) == 0: return prices[-1]
        
    X = torch.FloatTensor(np.array(X))
    y = torch.FloatTensor(np.array(y))
    
    if model_type == 'lstm':
        model = SimpleLSTM()
    else:
        model = SimpleTransformer()
        
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    
    model.train()
    epochs = 15
    for epoch in range(epochs):
        optimizer.zero_grad()
        y_pred = model(X)
        loss = criterion(y_pred, y)
        loss.backward()
        optimizer.step()
        
    model.eval()
    with torch.no_grad():
        last_seq = torch.FloatTensor(scaled_prices[-seq_length:]).unsqueeze(0)
        pred_scaled = model(last_seq)
        pred = scaler.inverse_transform(pred_scaled.numpy())[0][0]
        
    return float(pred)

def run_all_models(prices, horizons=[5, 20, 60, 120]):
    results = {}
    for h in horizons:
        results[str(h)] = {
            'XGBoost': train_and_predict_xgb(prices, h),
            'CatBoost': train_and_predict_cat(prices, h),
            'RandomForest': train_and_predict_rf(prices, h),
            'GradientBoosting': train_and_predict_gb(prices, h),
            'SVR': train_and_predict_svr(prices, h),
            'LSTM': train_and_predict_dl(prices, h, 'lstm'),
            'Transformer': train_and_predict_dl(prices, h, 'transformer')
        }
    return results
