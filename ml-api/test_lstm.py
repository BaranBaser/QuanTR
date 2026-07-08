import yfinance as yf
import numpy as np
from models import train_and_predict_dl, train_and_predict_xgb

stocks = ["THYAO.IS", "AKBNK.IS", "TUPRS.IS", "GARAN.IS", "ASELS.IS"]
horizon = 20
test_points = 5  # Test on 5 different points in the past

lstm_errors = []
xgb_errors = []

print("Running Backtest for LSTM vs XGBoost...")
print(f"Horizon: {horizon} days")

for stock in stocks:
    print(f"\n--- Fetching data for {stock} ---")
    data = yf.download(stock, period="2y", interval="1d", progress=False)
    if data.empty:
        continue
    
    # Extract close prices
    closes = data['Close'].values.flatten().tolist()
    
    # We need at least 150 days
    if len(closes) < 150:
        continue
        
    for i in range(test_points):
        # We step back in time
        # E.g., test point 0: we act as if we are at len(closes) - 1 - horizon
        # So the model predicts 'horizon' days ahead, which matches the actual last price
        offset = horizon + (i * 10) # step back by 10 days for each test point
        if offset > len(closes) - 50:
            break
            
        current_index = len(closes) - offset
        training_data = closes[:current_index]
        actual_future_price = closes[current_index + horizon - 1]
        
        # Predict LSTM
        lstm_pred = train_and_predict_dl(training_data, horizon, 'lstm')
        lstm_err = abs(lstm_pred - actual_future_price) / actual_future_price * 100
        lstm_errors.append(lstm_err)
        
        # Predict XGBoost
        xgb_pred = train_and_predict_xgb(training_data, horizon)
        xgb_err = abs(xgb_pred - actual_future_price) / actual_future_price * 100
        xgb_errors.append(xgb_err)
        
        print(f"[{stock} T-{offset}d] Actual: {actual_future_price:.2f} | LSTM: {lstm_pred:.2f} (Err: {lstm_err:.2f}%) | XGB: {xgb_pred:.2f} (Err: {xgb_err:.2f}%)")

print("\n=== FINAL RESULTS ===")
if len(lstm_errors) > 0:
    print(f"LSTM Average Error: {np.mean(lstm_errors):.2f}%")
    print(f"XGBoost Average Error: {np.mean(xgb_errors):.2f}%")
else:
    print("Not enough data to run tests.")
