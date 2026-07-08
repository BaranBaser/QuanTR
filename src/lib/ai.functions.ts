import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ─── Yahoo Finance helpers ──────────────────────────────────────────────────

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

async function yfFetch(symbol: string, range = "1d", interval = "1d") {
  try {
    const url = `${YF_BASE}/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    return json.chart?.result?.[0] ?? null;
  } catch {
    return null;
  }
}

function parseMeta(result: Record<string, unknown>) {
  const meta = result?.meta as Record<string, unknown> | undefined;
  if (!meta) return null;
  const price = (meta.regularMarketPrice as number) ?? 0;
  const prevClose = (meta.chartPreviousClose as number) ?? 0;
  const change = price - prevClose;
  const changePercent = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
  return {
    symbol: meta.symbol as string,
    name: (meta.shortName || meta.longName || meta.symbol) as string,
    price,
    prevClose,
    change,
    changePercent,
    high: (meta.regularMarketDayHigh as number) ?? 0,
    low: (meta.regularMarketDayLow as number) ?? 0,
    volume: (meta.regularMarketVolume as number) ?? 0,
    high52: (meta.fiftyTwoWeekHigh as number) ?? 0,
    low52: (meta.fiftyTwoWeekLow as number) ?? 0,
  };
}

// ─── Market Indexes ─────────────────────────────────────────────────────────

export type IndexData = {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  prevClose: number;
  high: number;
  low: number;
};

const INDEX_SYMBOLS: { name: string; symbol: string }[] = [
  { name: "BIST 100", symbol: "XU100.IS" },
  { name: "S&P 500", symbol: "^GSPC" },
  { name: "NASDAQ", symbol: "^IXIC" },
  { name: "DOLAR/TL", symbol: "USDTRY=X" },
  { name: "ALTIN", symbol: "GC=F" },
  { name: "EUR/TRY", symbol: "EURTRY=X" },
];

export const fetchIndexes = createServerFn({ method: "GET" })
  .validator(() => ({}))
  .handler(async () => {
    const results = await Promise.allSettled(
      INDEX_SYMBOLS.map(async (idx) => {
        const result = await yfFetch(idx.symbol);
        const meta = parseMeta(result as Record<string, unknown>);
        if (!meta) return null;
        const change = meta.price - meta.prevClose;
        const changePercent = meta.prevClose ? (change / meta.prevClose) * 100 : 0;
        return {
          name: idx.name,
          symbol: idx.symbol,
          value: meta.price,
          change,
          changePercent,
          prevClose: meta.prevClose,
          high: meta.high,
          low: meta.low,
        } as IndexData;
      }),
    );
    return results
      .filter((r): r is PromiseFulfilledResult<IndexData | null> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter(Boolean) as IndexData[];
  });

// ─── BIST Stocks (Genişletilmiş) ───────────────────────────────────────────

export type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
  sector: string;
};

// BIST 100 + popüler hisseler (genişletilmiş)
const BIST_SYMBOLS = [
  // Bankacılık (9)
  "AKBNK", "GARAN", "YKBNK", "HALKB", "VAKBN", "ISCTR", "TSKB", "QNBFB", "SKBNK",
  // Havacılık (3)
  "THYAO", "PGSUS", "TAVHL",
  // Enerji (10)
  "TUPRS", "PETKM", "ODAS", "AYDEM", "AKSEN", "ENJSA", "ENERY", "CWENE", "EUPWR", "ASTOR",
  // Holding (6)
  "SAHOL", "KCHOL", "DOHOL", "BRYAT", "EUREN",
  // Metal (2)
  "EREGL", "KRDMD",
  // Sanayi (6)
  "SISE", "ARCLK", "ECILC", "BRSAN", "CIMSA", "CVKMD",
  // Otomotiv (4)
  "FROTO", "TOASO", "TTRAK", "DOAS",
  // İletişim (2)
  "TCELL", "TTKOM",
  // Savunma (1)
  "ASELS",
  // Madencilik (3)
  "KOZAA", "KOZAL", "IHEVA",
  // Kimya (5)
  "SASA", "BRISA", "KONTR", "HEKTS", "AKSA",
  // Perakende (3)
  "BIMAS", "MGROS", "SOKM",
  // GYO (4)
  "EKGYO", "GLYHO", "DAPGM", "PSGYO",
  // İnşaat (3)
  "ISMEN", "ENKAI", "ALARK",
  // Tekstil (3)
  "KONKA", "MAVI", "CANTE",
  // Lojistik (1)
  "TGSAS",
  // İçecek (3)
  "AEFES", "CCOLA", "BTCIM",
  // Teknoloji (3)
  "VESTL", "EKOS", "FONET",
  // Sigorta (2)
  "ANSGR", "TURSG",
  // Spor (1)
  "FENER",
  // Finans (2)
  "DSTKF", "EFOR",
  // Diğer popüler hisseler (20+)
  "OTKAR", "OYAKC", "GESAN", "GLRMK", "GRSEL", "GRTHO",
  "IEYHO", "IZENR", "KLRHO", "KTLEV", "KUYAS", "MAGEN",
  "MIATK", "MPARK", "OBAMS", "ODINE", "PAHOL", "PASEU",
  "PATEK", "QUAGR", "RALYH", "REEDR", "SMRTG", "TABGD",
  "TRENJ", "TRMET", "ALTNY", "BALSU", "BERA", "BSOKE",
  "ESEN", "GENIL",
];

// Sektör eşleme (genişletilmiş)
const SECTOR_MAP: Record<string, string> = {
  // Bankacılık
  AKBNK: "Bankacılık", GARAN: "Bankacılık", YKBNK: "Bankacılık",
  HALKB: "Bankacılık", VAKBN: "Bankacılık", ISCTR: "Bankacılık",
  TSKB: "Bankacılık", QNBFB: "Bankacılık", SKBNK: "Bankacılık",
  // Havacılık
  THYAO: "Havacılık", PGSUS: "Havacılık", TAVHL: "Havacılık",
  // Enerji
  TUPRS: "Enerji", PETKM: "Enerji", ODAS: "Enerji", AYDEM: "Enerji",
  AKSEN: "Enerji", ENJSA: "Enerji", ENERY: "Enerji",
  CWENE: "Enerji", EUPWR: "Enerji", ASTOR: "Enerji",
  // Holding
  SAHOL: "Holding", KCHOL: "Holding", DOHOL: "Holding",
  BRYAT: "Holding", EUREN: "Holding",
  // Metal
  EREGL: "Metal", KRDMD: "Metal",
  // Sanayi
  SISE: "Sanayi", ARCLK: "Sanayi", ECILC: "Sanayi",
  BRSAN: "Sanayi", CIMSA: "Sanayi", CVKMD: "Sanayi",
  // Otomotiv
  TOASO: "Otomotiv", FROTO: "Otomotiv", TTRAK: "Otomotiv", DOAS: "Otomotiv",
  // İletişim
  TCELL: "İletişim", TTKOM: "İletişim",
  // Savunma
  ASELS: "Savunma",
  // Madencilik
  KOZAA: "Madencilik", KOZAL: "Madencilik", IHEVA: "Madencilik",
  // Kimya
  SASA: "Kimya", BRISA: "Kimya", KONTR: "Kimya", HEKTS: "Kimya", AKSA: "Kimya",
  // Perakende
  BIMAS: "Perakende", MGROS: "Perakende", SOKM: "Perakende",
  // GYO
  EKGYO: "GYO", GLYHO: "GYO", DAPGM: "GYO", PSGYO: "GYO",
  // İnşaat
  ISMEN: "İnşaat", ENKAI: "İnşaat", ALARK: "İnşaat",
  // Tekstil
  KONKA: "Tekstil", MAVI: "Tekstil", CANTE: "Tekstil",
  // Lojistik
  TGSAS: "Lojistik",
  // İçecek
  AEFES: "İçecek", CCOLA: "İçecek", BTCIM: "İçecek",
  // Teknoloji
  VESTL: "Teknoloji", EKOS: "Teknoloji", FONET: "Teknoloji",
  // Sigorta
  ANSGR: "Sigorta", TURSG: "Sigorta",
  // Spor
  FENER: "Spor",
  // Finans
  DSTKF: "Finans", EFOR: "Finans",
  // Diğer
  OTKAR: "Otomotiv", OYAKC: "Enerji", GESAN: "Sanayi",
  GLRMK: "Kimya", GRSEL: "Sanayi", GRTHO: "Holding",
  IEYHO: "İçecek", IZENR: "Enerji", KLRHO: "Holding",
  KTLEV: "Teknoloji", KUYAS: "Enerji", MAGEN: "Madencilik",
  MIATK: "Enerji", MPARK: "Sağlık", OBAMS: "Holding",
  ODINE: "Teknoloji", PAHOL: "Holding", PASEU: "Holding",
  PATEK: "Sanayi", QUAGR: "Holding", RALYH: "Holding",
  REEDR: "Enerji", SMRTG: "Holding", TABGD: "Holding",
  TRENJ: "Enerji", TRMET: "Sanayi", ALTNY: "Holding",
  BALSU: "Holding", BERA: "Holding", BSOKE: "Sanayi",
  ESEN: "Holding", GENIL: "Holding",
};

// Toplu veri çekme (batch) — 8'li gruplar halinde (hız için)
async function fetchBatch(symbols: string[], batchSize = 8): Promise<StockData[]> {
  const results: StockData[] = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(async (sym) => {
        const result = await yfFetch(`${sym}.IS`);
        const meta = parseMeta(result as Record<string, unknown>);
        if (!meta) return null;
        const changePercent = meta.prevClose
          ? ((meta.price - meta.prevClose) / meta.prevClose) * 100
          : 0;
        return {
          symbol: sym,
          name: meta.name,
          price: meta.price,
          change: meta.change,
          changePercent,
          volume: meta.volume,
          high: meta.high,
          low: meta.low,
          high52: meta.high52,
          low52: meta.low52,
          sector: SECTOR_MAP[sym] || "Diğer",
        } as StockData;
      }),
    );
    results.push(
      ...batchResults
        .filter((r): r is PromiseFulfilledResult<StockData | null> => r.status === "fulfilled")
        .map((r) => r.value)
        .filter(Boolean) as StockData[],
    );
  }
  return results;
}

export const fetchBistData = createServerFn({ method: "GET" })
  .validator(() => ({}))
  .handler(async () => {
    return fetchBatch(BIST_SYMBOLS);
  });

// Tekli hisse çekme (arama için)
export const fetchStockByQuery = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const obj = input as { query?: string };
    return { query: (obj?.query || "").toUpperCase() };
  })
  .handler(async ({ data }) => {
    if (!data.query) return [];
    const matched = BIST_SYMBOLS.filter((s) => s.includes(data.query)).slice(0, 20);
    if (matched.length === 0) return [];
    return fetchBatch(matched);
  });

export const fetchSingleStock = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const obj = input as { symbol?: string };
    return { symbol: (obj?.symbol || "THYAO").toUpperCase() };
  })
  .handler(async ({ data }) => {
    const result = await yfFetch(`${data.symbol}.IS`);
    return parseMeta(result as Record<string, unknown>);
  });

export const fetchStockHistory = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const obj = input as { symbol?: string; range?: string };
    return {
      symbol: (obj?.symbol || "THYAO").toUpperCase(),
      range: obj?.range || "1mo",
    };
  })
  .handler(async ({ data }) => {
    try {
      const result = await yfFetch(`${data.symbol}.IS`, data.range);
      if (!result?.timestamp || !result?.indicators?.quote?.[0]) return [];
      const quotes = result.indicators.quote[0];
      return result.timestamp.map((ts: number, i: number) => ({
        date: new Date(ts * 1000).toISOString(),
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i],
      }));
    } catch {
      return [];
    }
  });

// ─── News (RSS -> JSON proxy) ──────────────────────────────────────────────

export type NewsItem = {
  id: number;
  title: string;
  source: string;
  time: string;
  url: string;
  tag: string;
  impact: "high" | "medium" | "low";
  thumbnail?: string;
};

export const fetchNews = createServerFn({ method: "GET" })
  .validator(() => ({}))
  .handler(async () => {
    try {
      // Çoklu sorgu ile daha fazla haber
      const queries = ["borsa piyasa", "bist hisse", "türkiye ekonomi"];
      const allItems: Array<{
        title: string;
        publisher: string;
        link: string;
        providerPublishTime: number;
        thumbnail?: { resolutions: Array<{ url: string }> };
      }> = [];

      for (const q of queries) {
        try {
          const res = await fetch(
            `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotes_count=0&news_count=10&lang=tr-TR`,
            { headers: { "User-Agent": "Mozilla/5.0" } },
          );
          if (res.ok) {
            const json = await res.json();
            if (json.news) allItems.push(...json.news);
          }
        } catch {}
      }

      // Tekrarlanan haberleri temizle
      const seen = new Set<string>();
      const unique = allItems.filter((n) => {
        if (seen.has(n.title)) return false;
        seen.add(n.title);
        return true;
      });

      if (unique.length === 0) return getFallbackNews();

      return unique.slice(0, 30).map((n, i): NewsItem => ({
        id: i + 1,
        title: n.title,
        source: n.publisher,
        time: timeAgo(n.providerPublishTime * 1000),
        url: n.link,
        tag: guessTag(n.title),
        impact: guessImpact(n.title),
        thumbnail: n.thumbnail?.resolutions?.[0]?.url,
      }));
    } catch {
      return getFallbackNews();
    }
  });

function getFallbackNews(): NewsItem[] {
  return [
    { id: 1, title: "Piyasalar güncel verileri bekliyor", source: "stockbear", time: "şimdi", url: "#", tag: "Piyasa", impact: "medium" },
    { id: 2, title: "BIST 100 endeksi işlem görüyor", source: "stockbear", time: "şimdi", url: "#", tag: "BIST", impact: "medium" },
  ];
}

function timeAgo(dateMs: number): string {
  const diff = Date.now() - dateMs;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} dk önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} saat önce`;
  return `${Math.floor(hrs / 24)} gün önce`;
}

function guessTag(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("faiz") || t.includes("tcmb")) return "Ekonomi";
  if (t.includes("bist") || t.includes("endeks")) return "BIST";
  if (t.includes("dolar") || t.includes("euro") || t.includes("kur")) return "Döviz";
  if (t.includes("altın") || t.includes("emtia")) return "Emtia";
  if (t.includes("abd") || t.includes("fed")) return "Global";
  return "Piyasa";
}

function guessImpact(title: string): "high" | "medium" | "low" {
  const t = title.toLowerCase();
  if (t.includes("faiz") || t.includes("tcmb") || t.includes("enflasyon") || t.includes("tarım")) return "high";
  if (t.includes("bist") || t.includes("endeks") || t.includes("kar")) return "medium";
  return "low";
}

// ─── Economic Calendar ──────────────────────────────────────────────────────

export type CalendarEvent = {
  date: string;
  time: string;
  event: string;
  country: string;
  impact: "high" | "medium" | "low";
  forecast: string;
  previous: string;
};

export const fetchCalendar = createServerFn({ method: "GET" })
  .validator(() => ({}))
  .handler(async () => {
    try {
      const res = await fetch(
        "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
        { headers: { "User-Agent": "Mozilla/5.0" } },
      );
      if (!res.ok) return getFallbackCalendar();
      const json = await res.json();
      const items = json as Array<{
        title: string;
        date: string;
        country: string;
        impact: string;
        forecast: string;
        previous: string;
      }>;
      if (!items || items.length === 0) return getFallbackCalendar();
      return items.slice(0, 20).map((e): CalendarEvent => ({
        date: formatDate(e.date),
        time: new Date(e.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        event: e.title,
        country: countryFlag(e.country),
        impact: e.impact === "High" ? "high" : e.impact === "Medium" ? "medium" : "low",
        forecast: e.forecast || "-",
        previous: e.previous || "-",
      }));
    } catch {
      return getFallbackCalendar();
    }
  });

function getFallbackCalendar(): CalendarEvent[] {
  const now = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return {
      date: d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }),
      time: "10:00",
      event: "Veri yükleniyor...",
      country: "🌍",
      impact: "medium" as const,
      forecast: "-",
      previous: "-",
    };
  });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

function countryFlag(code: string): string {
  const flags: Record<string, string> = {
    US: "🇺🇸", TR: "🇹🇷", EU: "🇪🇺", GB: "🇬🇧", DE: "🇩🇪", JP: "🇯🇵", CN: "🇨🇳",
  };
  return flags[code] || "🌍";
}
