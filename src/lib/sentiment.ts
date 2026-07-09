// Basit keyword-based sentiment analysis for Turkish financial news
const POSITIVE_KEYWORDS = [
  "yükseliş", "yükselen", "artış", "artan", "kâr", "kar", "rekor", "büyüme", "büyüyen",
  "pozitif", "güçlü", "güçlenen", "iyileşme", "toparlanma", "alan", "alımlar", "talep",
  "destek", "destekliyor", "yükseltildi", "artırıldı", "başarılı", "ihracat", "kazanç",
  "prim", "getiri", "kazandıran", "yükseltme", "alım", "boğa", "iyimser"
];

const NEGATIVE_KEYWORDS = [
  "düşüş", "düşen", "azalış", "azalan", "zarar", "kayıp", "kriz", "risk", "tehlike",
  "negatif", "zayıf", "zayıflayan", "kötüleşme", "bozulma", "satış", "satışlar", "baskı",
  "direnç", "düşürüldü", "azaltıldı", "başarısız", "ithalat", "borç", "kayıplar",
  "gerileme", "dip", "ayı", "karamsar", "endişe", "belirsizlik", "enflasyon", "faiz artışı"
];

export function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of POSITIVE_KEYWORDS) {
    if (lower.includes(kw)) score++;
  }
  for (const kw of NEGATIVE_KEYWORDS) {
    if (lower.includes(kw)) score--;
  }
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

export function getSentimentScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of POSITIVE_KEYWORDS) {
    if (lower.includes(kw)) score++;
  }
  for (const kw of NEGATIVE_KEYWORDS) {
    if (lower.includes(kw)) score--;
  }
  return score;
}

export type SentimentResult = {
  overall: "positive" | "negative" | "neutral";
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  score: number; // -1 to 1 normalized
};

export function analyzeNewsSentiment(news: { title: string }[]): SentimentResult {
  let pos = 0, neg = 0, neu = 0;
  for (const n of news) {
    const s = analyzeSentiment(n.title);
    if (s === "positive") pos++;
    else if (s === "negative") neg++;
    else neu++;
  }
  const total = pos + neg + neu || 1;
  const normalized = (pos - neg) / total;
  const overall = normalized > 0.1 ? "positive" : normalized < -0.1 ? "negative" : "neutral";
  return { overall, positiveCount: pos, negativeCount: neg, neutralCount: neu, score: normalized };
}
