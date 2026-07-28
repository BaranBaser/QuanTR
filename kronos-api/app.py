"""
StockBear Kronos Prediction API
================================
Hugging Face Spaces üzerinde çalışan FastAPI uygulaması.
NeoQuasar/Kronos-small modelini kullanarak finansal zaman serisi tahmini yapar.

Model başlangıçta global olarak belleğe alınır, her istekte yeniden yüklenmez.
"""

import os
import sys
import traceback
from contextlib import asynccontextmanager
from typing import List, Optional

import numpy as np
import pandas as pd
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── Kronos model modülünü import etmek için path ayarla ─────────────────────
# Dockerfile'da /app/kronos_repo altına klonlanıyor
KRONOS_REPO_PATH = "/app/kronos_repo"
if os.path.exists(KRONOS_REPO_PATH):
    sys.path.insert(0, KRONOS_REPO_PATH)

# ─── Global Model Referansları ───────────────────────────────────────────────
predictor = None
model_loaded = False
load_error = None


def load_kronos_model():
    """Kronos modelini ve tokenizer'ı global olarak yükle."""
    global predictor, model_loaded, load_error
    try:
        from model import Kronos, KronosTokenizer, KronosPredictor

        print("🔄 Kronos modeli yükleniyor...")

        # Cihaz tespiti
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        print(f"📱 Cihaz: {device}")

        # Tokenizer ve model yükle
        tokenizer = KronosTokenizer.from_pretrained("NeoQuasar/Kronos-Tokenizer-base")
        model = Kronos.from_pretrained("NeoQuasar/Kronos-small")

        # Predictor oluştur
        predictor = KronosPredictor(model, tokenizer, device=device, max_context=512)

        model_loaded = True
        print("✅ Kronos modeli başarıyla yüklendi!")

    except Exception as e:
        load_error = str(e)
        print(f"❌ Kronos model yükleme hatası: {e}")
        traceback.print_exc()


# ─── FastAPI Lifecycle ───────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Uygulama başlangıcında modeli yükle."""
    load_kronos_model()
    yield
    # Shutdown: cleanup
    print("🛑 Kronos API kapanıyor...")


app = FastAPI(
    title="StockBear Kronos Prediction API",
    description="NeoQuasar/Kronos-small ile finansal K-line tahmin servisi",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — StockBear render sunucusundan gelen isteklere izin ver
CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:10000,https://stockbear.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # HF Space public API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic Modelleri ─────────────────────────────────────────────────────

class PriceBar(BaseModel):
    """Tek bir K-line (mum) verisi."""
    open: float
    high: float
    low: float
    close: float
    volume: Optional[float] = 0.0
    timestamp: str  # ISO format: "2025-01-01T00:00:00"


class PredictRequest(BaseModel):
    """Tahmin isteği."""
    symbol: str
    data: List[PriceBar]
    y_timestamps: List[str]  # Tahmin edilecek gelecek zaman damgaları
    temperature: Optional[float] = 1.0
    top_p: Optional[float] = 0.9
    sample_count: Optional[int] = 1


class PredictionPoint(BaseModel):
    """Tek bir tahmin noktası."""
    timestamp: str
    open: float
    high: float
    low: float
    close: float


class PredictResponse(BaseModel):
    """Tahmin yanıtı."""
    symbol: str
    model: str = "Kronos-small"
    predictions: List[PredictionPoint]


# ─── Endpoint'ler ────────────────────────────────────────────────────────────

@app.get("/")
def root():
    """Sağlık kontrolü."""
    return {
        "status": "ok",
        "service": "StockBear Kronos Prediction API",
        "model_loaded": model_loaded,
        "device": "cuda" if torch.cuda.is_available() else "cpu",
    }


@app.get("/health")
def health():
    """Detaylı sağlık kontrolü."""
    return {
        "status": "healthy" if model_loaded else "loading",
        "model_loaded": model_loaded,
        "error": load_error,
        "gpu_available": torch.cuda.is_available(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """
    OHLCV geçmişi alır, Kronos ile gelecek K-line'ları tahmin eder.
    
    - **symbol**: Hisse sembolü (THYAO, AAPL, vb.)
    - **data**: Geçmiş OHLCV verileri (en az 30, en fazla 512 bar)
    - **y_timestamps**: Tahmin edilecek gelecek zaman damgaları
    - **temperature**: Örnekleme sıcaklığı (varsayılan: 1.0)
    - **top_p**: Top-p örnekleme olasılığı (varsayılan: 0.9)
    """
    if not model_loaded:
        raise HTTPException(
            status_code=503,
            detail=f"Model henüz yüklenmedi. Hata: {load_error or 'Yükleniyor...'}"
        )

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

    try:
        # Geçmiş verileri DataFrame'e çevir
        records = []
        for bar in req.data:
            records.append({
                "open": bar.open,
                "high": bar.high,
                "low": bar.low,
                "close": bar.close,
                "volume": bar.volume or 0.0,
            })

        x_df = pd.DataFrame(records)

        # Zaman damgalarını hazırla
        x_timestamps = pd.Series(
            [pd.Timestamp(bar.timestamp) for bar in req.data]
        )
        y_timestamps = pd.Series(
            [pd.Timestamp(ts) for ts in req.y_timestamps]
        )

        pred_len = len(req.y_timestamps)

        # Kronos tahmini çalıştır
        with torch.no_grad():
            pred_df = predictor.predict(
                df=x_df,
                x_timestamp=x_timestamps,
                y_timestamp=y_timestamps,
                pred_len=pred_len,
                T=req.temperature,
                top_p=req.top_p,
                sample_count=req.sample_count,
            )

        # Sonuçları JSON'a çevir
        predictions = []
        for i, ts in enumerate(req.y_timestamps):
            row = pred_df.iloc[i] if i < len(pred_df) else pred_df.iloc[-1]
            predictions.append(PredictionPoint(
                timestamp=ts,
                open=round(float(row.get("open", row.get("close", 0))), 4),
                high=round(float(row.get("high", row.get("close", 0))), 4),
                low=round(float(row.get("low", row.get("close", 0))), 4),
                close=round(float(row.get("close", 0)), 4),
            ))

        return PredictResponse(
            symbol=req.symbol,
            predictions=predictions,
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Tahmin hatası: {str(e)}"
        )


# ─── Standalone çalıştırma ──────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
