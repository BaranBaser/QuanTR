from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from models import run_all_models
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predict_lock = asyncio.Lock()

class PredictRequest(BaseModel):
    symbol: str
    prices: List[float]
    horizons: List[int] = [5, 20, 60, 120]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Stockbear Advanced ML API is running"}

@app.post("/predict")
async def predict(req: PredictRequest):
    if len(req.prices) < 30:
        raise HTTPException(status_code=400, detail="At least 30 data points required")
        
    async with predict_lock:
        predictions = await asyncio.to_thread(run_all_models, req.prices, req.horizons)
        
    return {"symbol": req.symbol, "predictions": predictions}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
