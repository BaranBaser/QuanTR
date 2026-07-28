from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from models import run_all_models
from kronos_client import predict_with_kronos, check_kronos_health
from fastapi.middleware.cors import CORSMiddleware
import os
import datetime

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

class KronosPriceBar(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: Optional[float] = 0.0
    timestamp: str

class KronosRequest(BaseModel):
    symbol: str
    data: List[KronosPriceBar]
    y_timestamps: List[str]
    temperature: Optional[float] = 1.0
    top_p: Optional[float] = 0.9

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Stockbear Advanced ML API is running (with Kronos support)"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict")
def predict(req: PredictRequest):
    if len(req.data) < 30:
        raise HTTPException(status_code=422, detail="Not enough data for prediction. Minimum 30 bars required.")
    
    ohlcv = [bar.model_dump() for bar in req.data]
    predictions = run_all_models(ohlcv, req.horizons)
    return {"symbol": req.symbol, "predictions": predictions}

# ─── Kronos Endpoint'leri ────────────────────────────────────────────────────

@app.get("/kronos/health")
def kronos_health():
    """Kronos HF Space sağlık kontrolü."""
    return check_kronos_health()

@app.post("/predict/kronos")
def predict_kronos(req: KronosRequest):
    """
    Kronos modeli ile tahmin yap.
    Veriyi HF Space'e iletir ve sonuçları döndürür.
    """
    if len(req.data) < 30:
        raise HTTPException(
            status_code=422,
            detail="En az 30 bar geçmiş veri gereklidir."
        )

    if len(req.y_timestamps) == 0:
        raise HTTPException(
            status_code=422,
            detail="En az 1 gelecek zaman damgası (y_timestamps) gereklidir."
        )

    ohlcv_data = [bar.model_dump() for bar in req.data]
    
    result = predict_with_kronos(
        symbol=req.symbol,
        ohlcv_data=ohlcv_data,
        future_timestamps=req.y_timestamps,
        temperature=req.temperature,
        top_p=req.top_p,
    )

    if result is None:
        raise HTTPException(
            status_code=503,
            detail="Kronos HF Space'e bağlanılamadı veya tahmin yapılamadı. Space uyuyor olabilir."
        )

    # DataFrame'i JSON'a çevir
    predictions = []
    for ts, row in result.iterrows():
        predictions.append({
            "timestamp": ts.isoformat(),
            "open": round(float(row.get("open", 0)), 4),
            "high": round(float(row.get("high", 0)), 4),
            "low": round(float(row.get("low", 0)), 4),
            "close": round(float(row.get("close", 0)), 4),
        })

    return {
        "symbol": req.symbol,
        "model": "Kronos-small",
        "predictions": predictions,
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
