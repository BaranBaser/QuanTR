// ml.engine.ts
// Kapsamlı Algoritmik ve Matematiksel Karar Motoru (LLM veya dış API kullanılmaz)

export type MLModelName = "LinearRegression" | "MomentumExtrapolation" | "MeanReversion" | "EMA_Projection";

export interface ModelPrediction {
  model: MLModelName;
  prediction: number;
  weight: number;
  rmse: number;
}

export interface HorizonPrediction {
  horizonDays: number; // 1, 3, 5, 10, 20 vb.
  expectedPrice: number;
  lowerBand: number;
  upperBand: number;
  expectedReturnPercent: number;
  confidence: number;
  rmse: number;
  models: ModelPrediction[];
}

export interface EngineResult {
  decision: "AL" | "SAT" | "BEKLE";
  confidenceScore: number;
  rawScore: number;
  currentPrice: number;
  volatility: number;
  trend: "YÜKSELEN" | "DÜŞEN" | "YATAY";
  predictions: HorizonPrediction[];
  indicators: {
    rsi: number;
    macd: number;
    macdSignal: number;
    sma20: number;
    sma50: number;
  };
}

// Temel İndikatörler
export function calcRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  if (losses === 0) return 100;
  if (gains === 0) return 0;
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
}

export function calcSMA(closes: number[], period: number): number {
  if (closes.length < period) return closes[closes.length - 1] || 0;
  return closes.slice(-period).reduce((a, b) => a + b, 0) / period;
}

export function calcEMA(closes: number[], period: number): number {
  if (closes.length < period) return closes[closes.length - 1] || 0;
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

// Tahmin Modelleri
function predictLinearRegression(closes: number[], horizon: number): number {
  const n = closes.length;
  if (n < 2) return closes[closes.length - 1] || 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += closes[i];
    sumXY += i * closes[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return slope * (n - 1 + horizon) + intercept;
}

function predictMomentum(closes: number[], horizon: number): number {
  if (closes.length < 10) return closes[closes.length - 1] || 0;
  const current = closes[closes.length - 1];
  const past = closes[closes.length - 10];
  const dailyRate = Math.pow(current / past, 1 / 10) - 1;
  // Sönümlemeli momentum (aşırı uçuşları engellemek için)
  const dampedRate = dailyRate * 0.5;
  return current * Math.pow(1 + dampedRate, horizon);
}

function predictMeanReversion(closes: number[], horizon: number): number {
  const current = closes[closes.length - 1] || 0;
  const sma50 = calcSMA(closes, 50);
  // Fiyatın SMA50'ye yavaşça döneceğini varsayar
  const diff = sma50 - current;
  const reversionRate = 0.1; // Günlük %10 kapanma
  return current + diff * (1 - Math.pow(1 - reversionRate, horizon));
}

function predictEMAProjection(closes: number[], horizon: number): number {
  const current = closes[closes.length - 1] || 0;
  const ema10 = calcEMA(closes, 10);
  const ema20 = calcEMA(closes, 20);
  const diff = ema10 - ema20;
  return current + diff * (horizon / 5);
}

// Dinamik Backtest ve Ağırlıklandırma
async function calculateEnsemblePrediction(closes: number[], horizon: number, pythonData?: any): Promise<HorizonPrediction> {
  const currentPrice = closes[closes.length - 1] || 0;
  
  // Local TS Models
  const models: Array<{ name: MLModelName; fn: (c: number[], h: number) => number }> = [
    { name: "LinearRegression", fn: predictLinearRegression },
    { name: "MomentumExtrapolation", fn: predictMomentum },
    { name: "MeanReversion", fn: predictMeanReversion },
    { name: "EMA_Projection", fn: predictEMAProjection }
  ];

  const evaluatedModels: ModelPrediction[] = [];

  // Geçmiş veri ile test et (Horizon kadar gün geriye git)
  // Eğer yeterli veri yoksa basit ağırlık ver.
  const testPointIndex = closes.length - 1 - horizon;
  
  let totalInverseRmse = 0;

  for (const model of models) {
    let rmse = 0;
    if (testPointIndex > 20) {
      const historicalSlice = closes.slice(0, testPointIndex + 1);
      const actualTarget = closes[closes.length - 1];
      const predictedTarget = model.fn(historicalSlice, horizon);
      rmse = Math.abs(predictedTarget - actualTarget) / actualTarget * 100;
    } else {
      rmse = 5;
    }
    
    if (rmse > 50) rmse = 50; 
    if (rmse < 0.1) rmse = 0.1;

    const inverseRmse = 1 / rmse;
    totalInverseRmse += inverseRmse;

    const futurePrediction = model.fn(closes, horizon);
    let boundedPrediction = futurePrediction;
    if (boundedPrediction > currentPrice * 1.5) boundedPrediction = currentPrice * 1.5;
    if (boundedPrediction < currentPrice * 0.5) boundedPrediction = currentPrice * 0.5;

    evaluatedModels.push({
      model: model.name,
      prediction: boundedPrediction,
      weight: inverseRmse,
      rmse: rmse
    });
  }

  // Ağırlıklı ortalama al
  let finalExpectedPrice = 0;
  let avgRmse = 0;
  
  for (const em of evaluatedModels) {
    const normalizedWeight = em.weight / totalInverseRmse;
    em.weight = normalizedWeight;
    finalExpectedPrice += em.prediction * normalizedWeight;
    avgRmse += em.rmse * normalizedWeight;
  }

  // Volatiliteye göre Alt ve Üst Bant
  const slice20 = closes.slice(-20);
  const stdDev = Math.sqrt(slice20.reduce((acc, val) => acc + Math.pow(val - calcSMA(slice20, 20), 2), 0) / 20) || (currentPrice * 0.02);
  const bandWidth = stdDev * Math.sqrt(horizon); // Zamanla artan belirsizlik

  // Güven Skoru
  let confidence = 100 - avgRmse * 5; 
  if (confidence > 99) confidence = 99;
  if (confidence < 10) confidence = 10;

  return {
    horizonDays: horizon,
    expectedPrice: finalExpectedPrice,
    lowerBand: finalExpectedPrice - bandWidth,
    upperBand: finalExpectedPrice + bandWidth,
    expectedReturnPercent: ((finalExpectedPrice - currentPrice) / currentPrice) * 100,
    confidence: confidence,
    rmse: avgRmse,
    models: evaluatedModels
  };
}

// Ana AI Motoru Çalıştırıcısı
export async function runAIEngine(history: { close: number; volume: number }[], symbol: string, dataCount: number = 252): Promise<EngineResult> {
  const slicedHistory = history.slice(-dataCount);
  if (slicedHistory.length < 30) {
    throw new Error("Analiz için en az 30 günlük geçmiş veri gereklidir.");
  }
  
  const closes = slicedHistory.map(h => h.close);
  const currentPrice = closes[closes.length - 1];

  // Temel İndikatörler
  const rsi = calcRSI(closes, 14);
  const sma20 = calcSMA(closes, 20);
  const sma50 = calcSMA(closes, 50);
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macd = ema12 - ema26;
  const macdSignal = calcEMA(closes.slice(-9), 9);

  // Volatilite hesapla
  const slice20 = closes.slice(-20);
  const mean20 = calcSMA(slice20, 20);
  const volatility = (Math.sqrt(slice20.reduce((acc, val) => acc + Math.pow(val - mean20, 2), 0) / 20) / mean20) * 100;

  // Trend Tespiti
  const trend = sma20 > sma50 ? "YÜKSELEN" : sma20 < sma50 * 0.95 ? "DÜŞEN" : "YATAY";

  // Tahminleri Üret (Gelecek 1, 5, 20, 60, 120 gün)
  const horizons = [1, 5, 20, 60, 120];
  const predictions = await Promise.all(horizons.map(h => calculateEnsemblePrediction(closes, h)));

  // Bulanık Mantık Karar Motoru (AL / SAT / BEKLE)
  let score = 50; // Başlangıç nötr
  
  // RSI Kuralları
  if (rsi < 30) score += 15; // Aşırı satım, fırsat
  else if (rsi > 70) score -= 15; // Aşırı alım, risk

  // MACD Kuralları
  if (macd > macdSignal) score += 10;
  else score -= 10;

  // Trend Kuralları
  if (trend === "YÜKSELEN") score += 10;
  if (trend === "DÜŞEN") score -= 10;

  // Orta-Uzun vade (20 gün) tahmini pozitif mi?
  const pred20 = predictions.find(p => p.horizonDays === 20);
  if (pred20) {
    if (pred20.expectedReturnPercent > 3) score += 15;
    else if (pred20.expectedReturnPercent < -3) score -= 15;
    
    // Model RMSE'si yüksekse (Güvenilir değilse) skoru merkeze çek (Realism Penalty)
    if (pred20.rmse > 10) {
      score = score > 50 ? score - 10 : score + 10; 
    }
  }

  // Karar belirle
  let decision: "AL" | "SAT" | "BEKLE" = "BEKLE";
  if (score >= 60) decision = "AL";
  else if (score <= 40) decision = "SAT";

  // Güvenlik: Volatilite çok yüksekse AL kararını BEKLE yap (Risk yönetimi)
  if (decision === "AL" && volatility > 25) decision = "BEKLE";

  // Nihai güven skoru
  let finalConfidence = Math.max(10, Math.min(99, score));
  if (decision === "BEKLE") {
    // Bekle kararı belirsizlik demektir, güven skorunu 50 civarına çekeriz
    finalConfidence = 100 - Math.abs(score - 50) * 2;
  }

  return {
    decision,
    confidenceScore: finalConfidence,
    rawScore: score,
    currentPrice,
    volatility,
    trend,
    predictions,
    indicators: {
      rsi,
      macd,
      macdSignal,
      sma20,
      sma50
    }
  };
}

export interface SimpleTechnicalResult {
  decision: "AL" | "SAT" | "BEKLE";
  rawScore: number;
  currentPrice: number;
}

// Tüm BIST100'e hızlıca uygulanacak hafif teknik tarayıcı motoru
export function runSimpleTechnicalEngine(
  history: { close: number; high?: number; low?: number; volume?: number }[],
  symbol: string
): SimpleTechnicalResult {
  const closes = history.map(h => h.close);
  const currentPrice = closes[closes.length - 1];

  // Temel İndikatörler
  const rsi = calcRSI(closes, 14);
  const sma20 = calcSMA(closes, 20);
  const sma50 = calcSMA(closes, 50);
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macd = ema12 - ema26;
  const macdSignal = calcEMA(closes.slice(-9), 9);

  const trend = sma20 > sma50 ? "YÜKSELEN" : sma20 < sma50 * 0.95 ? "DÜŞEN" : "YATAY";

  let score = 50;

  // RSI
  if (rsi < 30) score += 20; // Aşırı satım -> Güçlü AL
  else if (rsi > 70) score -= 20; // Aşırı alım -> Güçlü SAT

  // MACD
  if (macd > macdSignal) score += 10;
  else score -= 10;

  // Trend
  if (trend === "YÜKSELEN") score += 10;
  else if (trend === "DÜŞEN") score -= 10;

  // Destek / Direnç (Pivot) Analizi (Son günün verisi üzerinden)
  const lastDay = history[history.length - 1];
  if (lastDay && lastDay.high && lastDay.low) {
    const P = (lastDay.high + lastDay.low + lastDay.close) / 3;
    const R1 = 2 * P - lastDay.low;
    const S1 = 2 * P - lastDay.high;

    // Fiyat desteğe S1'e çok yakınsa veya altındaysa -> Tepki alımı fırsatı
    if (currentPrice <= S1 * 1.02) score += 15;
    // Fiyat dirence R1'e çok yakınsa veya üstündeyse -> Kâr satışı riski
    else if (currentPrice >= R1 * 0.98) score -= 15;
  } else {
    // Eğer high/low yoksa fiyata göre basit sapma
    if (currentPrice < sma20 * 0.95) score += 10;
    if (currentPrice > sma20 * 1.05) score -= 10;
  }

  // Karar
  let decision: "AL" | "SAT" | "BEKLE" = "BEKLE";
  if (score >= 60) decision = "AL"; // Yüksek hassasiyet için 70 yerine 60
  else if (score <= 40) decision = "SAT"; // Yüksek hassasiyet için 30 yerine 40

  return {
    decision,
    rawScore: score,
    currentPrice
  };
}

