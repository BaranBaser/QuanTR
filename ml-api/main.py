from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from models import run_all_models
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:10000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PriceBar(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: float

class PredictRequest(BaseModel):
    symbol: str
    data: List[PriceBar]
    horizons: Optional[List[int]] = [5, 20, 60, 120]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Stockbear Advanced ML API is running"}

@app.post("/predict")
def predict(req: PredictRequest):
    if len(req.data) < 30:
        return {"error": "Not enough data for prediction. Minimum 30 bars required."}
    
    ohlcv = [bar.model_dump() for bar in req.data]
    predictions = run_all_models(ohlcv, req.horizons)
    return {"symbol": req.symbol, "predictions": predictions}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
