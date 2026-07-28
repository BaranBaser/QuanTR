---
title: StockBear Kronos API
emoji: 📈
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
license: mit
---

# StockBear Kronos Prediction API

Kronos-small financial time series prediction API for StockBear.

Uses the [NeoQuasar/Kronos-small](https://huggingface.co/NeoQuasar/Kronos-small) model.

## Endpoints

- `GET /` — Health check
- `GET /health` — Model status
- `POST /predict` — Generate OHLCV predictions
