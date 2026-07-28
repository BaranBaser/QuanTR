"""
Kronos HF Space İstemcisi
=========================
Hugging Face Spaces üzerinde çalışan Kronos Prediction API'sine
POST isteği atan hafif Python istemci fonksiyonu.

512MB RAM sınırı olan Render sunucusunda çalışır — model yüklemez,
sadece HTTP isteği atar ve sonuçları Pandas DataFrame olarak döndürür.
"""

import os
import requests
import pandas as pd
from typing import List, Dict, Optional

# HF Space URL'si — ortam değişkeniyle yapılandırılabilir
DEFAULT_HF_URL = os.environ.get(
    "KRONOS_HF_URL",
    "https://YOUR-USERNAME-kronos-api.hf.space"  # Placeholder — gerçek URL ile değiştirin
)

# Timeout (saniye) — HF Space ilk çağrıda cold start yapabilir
DEFAULT_TIMEOUT = 120


def predict_with_kronos(
    symbol: str,
    ohlcv_data: List[Dict],
    future_timestamps: List[str],
    hf_url: Optional[str] = None,
    timeout: int = DEFAULT_TIMEOUT,
    temperature: float = 1.0,
    top_p: float = 0.9,
) -> Optional[pd.DataFrame]:
    """
    Kronos HF Space API'sine OHLCV verisi gönderip tahmin sonuçlarını çeker.

    Args:
        symbol: Hisse senedi sembolü (örn: "THYAO", "AAPL")
        ohlcv_data: Geçmiş fiyat verileri listesi. Her eleman:
                     {"open": float, "high": float, "low": float,
                      "close": float, "volume": float, "timestamp": str}
        future_timestamps: Tahmin edilecek gelecek tarihler (ISO format)
                           Örn: ["2025-08-01T00:00:00", "2025-08-02T00:00:00"]
        hf_url: Hugging Face Space API URL'si (opsiyonel, default env'den gelir)
        timeout: İstek zaman aşımı (saniye, varsayılan: 120)
        temperature: Örnekleme sıcaklığı (varsayılan: 1.0)
        top_p: Top-p örnekleme (varsayılan: 0.9)

    Returns:
        pd.DataFrame: Tahmin sonuçları (timestamp, open, high, low, close)
                      veya hata durumunda None

    Raises:
        Hata durumunda None döndürür, exception fırlatmaz.
    """
    base_url = (hf_url or DEFAULT_HF_URL).rstrip("/")
    url = f"{base_url}/predict"

    payload = {
        "symbol": symbol,
        "data": ohlcv_data,
        "y_timestamps": future_timestamps,
        "temperature": temperature,
        "top_p": top_p,
        "sample_count": 1,
    }

    try:
        response = requests.post(
            url,
            json=payload,
            timeout=timeout,
            headers={"Content-Type": "application/json"},
        )

        if response.status_code != 200:
            error_detail = "Bilinmeyen hata"
            try:
                error_detail = response.json().get("detail", response.text)
            except Exception:
                error_detail = response.text
            print(f"[Kronos Client] API hatası ({response.status_code}): {error_detail}")
            return None

        result = response.json()
        predictions = result.get("predictions", [])

        if not predictions:
            print("[Kronos Client] API boş tahmin döndürdü.")
            return None

        # Sonuçları DataFrame'e çevir
        df = pd.DataFrame(predictions)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df = df.set_index("timestamp")

        return df

    except requests.exceptions.ConnectionError as e:
        print(f"[Kronos Client] Bağlantı hatası: {e}")
        print("[Kronos Client] HF Space uyuyor olabilir, birkaç dakika sonra tekrar deneyin.")
        return None

    except requests.exceptions.Timeout:
        print(f"[Kronos Client] Zaman aşımı ({timeout}s). HF Space cold start yapıyor olabilir.")
        return None

    except requests.exceptions.JSONDecodeError as e:
        print(f"[Kronos Client] JSON çözümleme hatası: {e}")
        return None

    except Exception as e:
        print(f"[Kronos Client] Beklenmeyen hata: {e}")
        return None


def check_kronos_health(hf_url: Optional[str] = None) -> Dict:
    """
    Kronos HF Space'in sağlık durumunu kontrol eder.
    
    Returns:
        dict: {"status": "healthy"/"error", "model_loaded": bool, ...}
    """
    base_url = (hf_url or DEFAULT_HF_URL).rstrip("/")
    try:
        response = requests.get(f"{base_url}/health", timeout=30)
        if response.status_code == 200:
            return response.json()
        return {"status": "error", "code": response.status_code}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── Test / Demo ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Basit sağlık kontrolü
    print("Kronos HF Space sağlık kontrolü:")
    health = check_kronos_health()
    print(health)

    # Test tahmini (dummy veri)
    dummy_data = []
    import datetime
    base_date = datetime.datetime(2025, 1, 1)
    for i in range(60):
        d = base_date + datetime.timedelta(days=i)
        price = 100 + i * 0.5
        dummy_data.append({
            "open": price,
            "high": price + 1.5,
            "low": price - 1.0,
            "close": price + 0.5,
            "volume": 1000000 + i * 10000,
            "timestamp": d.isoformat(),
        })

    future_ts = [
        (base_date + datetime.timedelta(days=60 + i)).isoformat()
        for i in range(5)
    ]

    print("\nKronos tahmin testi:")
    result = predict_with_kronos("TEST", dummy_data, future_ts)
    if result is not None:
        print(result)
    else:
        print("Tahmin alınamadı (HF Space çalışmıyor olabilir)")
