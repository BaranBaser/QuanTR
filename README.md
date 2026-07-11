# stockbear

Yapay zeka destekli BIST hisse analiz platformu. Gerçek zamanlı Yahoo Finance verileri, makine öğrenmesi tabanlı teknik analiz ve profesyonel raporlama.

## Tech Stack

- **Frontend**: TanStack Start (React 19 + Vite + Nitro)
- **ML API**: Python FastAPI
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts, lightweight-charts
- **Auth**: Firebase Auth (isteğe bağlı)
- **Deploy**: Docker + Render

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev          # Varsayılan: http://localhost:3000
```

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npx vitest run
```

## Tip Kontrolü

```bash
node_modules/.bin/tsc --noEmit
```

## Ortam Değişkenleri

`.env` dosyası oluşturun (`.env.example` şablon olarak kullanılabilir):

| Değişken | Açıklama | Zorunlu |
|----------|----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API anahtarı | Hayır (boşsa auth devre dışı) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Hayır |
| `VITE_FIREBASE_PROJECT_ID` | Firebase proje ID | Hayır |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Hayır |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID | Hayır |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Hayır |

## Mimari

```
stockbear/
├── src/
│   ├── routes/          # Sayfa bileşenleri (TanStack Router)
│   ├── components/      # Yeniden kullanılabilir bileşenler
│   ├── lib/             # Yardımcı fonksiyonlar, API çağrıları, ML motoru
│   └── assets/          # Görseller
├── ml-api/              # Python FastAPI ML API
│   ├── main.py          # API endpointleri
│   └── models.py        # ML modelleri
├── Dockerfile           # Production build
├── start.sh             # Container başlangıç scripti
└── render.yaml          # Render deploy config
```

## Özellikler

- **Canlı Fiyatlar**: Yahoo Finance ile BIST hisselerinin gerçek zamanlı fiyatları
- **Teknik Analiz**: RSI, MACD, Bollinger Bantları, Stokastik, ADX, CCI, ATR, OBV, VWAP
- **AI Sinyalleri**: Ridge Regression, Momentum, Mean Reversion, EMA modelleri ile AL/SAT/BEKLE sinyalleri
- **Portföy Takibi**: Pozisyon ekleme, kâr/zarar hesaplama, sektör dağılımı
- **Hisse Karşılaştırma**: 2-4 hisse arasında karşılaştırmalı analiz
- **Haberler**: Yahoo Finance haberleri, duygu analizi ile
- **Alarm Sistemi**: Fiyat alarmı, tarayıcı bildirimleri
- **Grafik**: TradingView tarzı candlestick grafik
- **Screener**: Filtreleme ile hisse tarama
- **Rapor**: PNG/PDF olarak profesyonel analiz raporu
- **PWA**: Offline destek, mobil uygulama deneyimi

## Lisans

MIT
