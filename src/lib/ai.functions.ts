import { createServerFn } from "@tanstack/react-start";
import { SECTOR_MAP } from "./market-data";

// ─── Yahoo Finance helpers ──────────────────────────────────────────────────

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

// Simple in-memory cache for Yahoo Finance API calls
const yfCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60_000; // 60 seconds

async function yfFetch(symbol: string, range = "1d", interval = "1d") {
  try {
    const cacheKey = `${symbol}:${range}:${interval}`;
    const cached = yfCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as Record<string, unknown>;
    }

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
    const result = json.chart?.result?.[0] ?? null;
    
    if (result) {
      yfCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }
    
    return result;
  } catch (e) {
    console.warn("yfFetch error:", symbol, e);
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

type IndexData = {
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

export const BIST_SYMBOLS = ["A1CAP","A1YEN","AAGYO","ACSEL","ADEL","ADESE","ADGYO","AEFES","AFYON","AGESA","AGHOL","AGROT","AGYO","AHGAZ","AHSGY","AKBNK","AKCNS","AKENR","AKFGY","AKFIS","AKFYE","AKGRT","AKHAN","AKMGY","AKSA","AKSEN","AKSGY","AKSUE","AKYHO","ALARK","ALBRK","ALCAR","ALCTL","ALFAS","ALGYO","ALKA","ALKIM","ALKLC","ALTNY","ALVES","ANELE","ANGEN","ANHYT","ANSGR","ARASE","ARCLK","ARDYZ","ARENA","ARFYE","ARMGD","ARSAN","ARTMS","ARZUM","ASELS","ASGYO","ASTOR","ASUZU","ATAGY","ATAKP","ATATP","ATATR","ATEKS","ATLAS","ATSYH","AVGYO","AVHOL","AVOD","AVPGY","AVTUR","AYCES","AYDEM","AYEN","AYES","AYGAZ","AZTEK","BAGFS","BAHKM","BAKAB","BALAT","BALSU","BANVT","BARMA","BASCM","BASGZ","BAYRK","BEGYO","BERA","BESLR","BESTE","BEYAZ","BFREN","BIENY","BIGCH","BIGEN","BIGTK","BIMAS","BINBN","BINHO","BIOEN","BIZIM","BJKAS","BLCYT","BLUME","BMSCH","BMSTL","BNTAS","BOBET","BORLS","BORSK","BOSSA","BRISA","BRKO","BRKSN","BRKVY","BRLSM","BRMEN","BRSAN","BRYAT","BSOKE","BTCIM","BUCIM","BULGS","BURCE","BURVA","BVSAN","BYDNR","CANTE","CASA","CATES","CCOLA","CELHA","CEMAS","CEMTS","CEMZY","CEOEM","CGCAM","CIMSA","CLEBI","CMBTN","CMENT","CONSE","COSMO","CRDFA","CRFSA","CUSAN","CVKMD","CWENE","DAGI","DAPGM","DARDL","DCTTR","DENGE","DERHL","DERIM","DESA","DESPC","DEVA","DGATE","DGGYO","DGNMO","DIRIT","DITAS","DMRGD","DMSAS","DNISI","DOAS","DOCO","DOFER","DOFRB","DOGUB","DOHOL","DOKTA","DSTKF","DUNYH","DURDO","DURKN","DYOBY","DZGYO","EBEBK","ECILC","ECOGR","ECZYT","EDATA","EDIP","EFOR","EGEEN","EGEGY","EGEPO","EGGUB","EGPRO","EGSER","EKDMR","EKGYO","EKIZ","EKOS","EKSUN","ELITE","EMKEL","EMNIS","EMPAE","ENDAE","ENERY","ENJSA","ENKAI","ENPRA","ENSRI","ENTRA","EPLAS","ERBOS","ERCB","EREGL","ERSU","ESCAR","ESCOM","ESEN","ETILR","ETYAT","EUHOL","EUKYO","EUPWR","EUREN","EUYO","EYGYO","FADE","FENER","FLAP","FMIZP","FONET","FORMT","FORTE","FRIGO","FRMPL","FROTO","FZLGY","GARAN","GARFA","GATEG","GEDIK","GEDZA","GENIL","GENKM","GENTS","GEREL","GESAN","GIPTA","GLBMD","GLCVY","GLRMK","GLRYH","GLYHO","GMTAS","GOKNR","GOLDA","GOLTS","GOODY","GOZDE","GRNYO","GRSEL","GRTHO","GSDDE","GSDHO","GSRAY","GUBRF","GUNDG","GWIND","GZNMI","HALKB","HATEK","HATSN","HDFGS","HEDEF","HEKTS","HKTM","HLGYO","HOROZ","HRKET","HTTBT","HUBVC","HUNER","HURGZ","ICBCT","ICUGS","IDGYO","IEYHO","IHAAS","IHEVA","IHGZT","IHLAS","IHLGM","IHYAY","IMASM","INDES","INFO","INGRM","INTEK","INTEM","INVEO","INVES","ISATR","ISBIR","ISBTR","ISCTR","ISDMR","ISFIN","ISGSY","ISGYO","ISKPL","ISKUR","ISMEN","ISSEN","ISYAT","IZENR","IZFAS","IZINV","IZMDC","JANTS","KAPLM","KAREL","KARSN","KARTN","KATMR","KAYSE","KBORU","KCAER","KCHOL","KENT","KERVN","KFEIN","KGYO","KIMMR","KLGYO","KLKIM","KLMSN","KLNMA","KLRHO","KLSER","KLSYN","KLYPV","KMPUR","KNFRT","KOCMT","KONKA","KONTR","KONYA","KOPOL","KORDS","KOTON","KRDMA","KRDMB","KRDMD","KRGYO","KRONT","KRPLS","KRSTL","KRTEK","KRVGD","KSTUR","KTLEV","KTSKR","KUTPO","KUVVA","KUYAS","KZBGY","KZGYO","LIDER","LIDFA","LILAK","LINK","LKMNH","LMKDC","LOGO","LRSHO","LUKSK","LXGYO","LYDHO","LYDYE","MAALT","MACKO","MAGEN","MAKIM","MAKTK","MANAS","MARBL","MARKA","MARMR","MARTI","MAVI","MCARD","MEDTR","MEGAP","MEGMT","MEKAG","MEPET","MERCN","MERIT","MERKO","METRO","MEYSU","MGROS","MHRGY","MIATK","MMCAS","MNDRS","MNDTR","MOBTL","MOGAN","MOPAS","MPARK","MRGYO","MRSHL","MSGYO","MTRKS","MTRYO","MZHLD","NATEN","NETAS","NETCD","NIBAS","NTGAZ","NTHOL","NUGYO","NUHCM","OBAMS","OBASE","ODAS","ODINE","OFSYM","ONCSM","ONRYT","ORCAY","ORGE","ORMA","ORZAX","OSMEN","OSTIM","OTKAR","OTTO","OYAKC","OYAYO","OYLUM","OYYAT","OZATD","OZGYO","OZKGY","OZRDN","OZSUB","OZYSR","PAGYO","PAHOL","PAMEL","PAPIL","PARSN","PASEU","PATEK","PCILT","PEKGY","PENGD","PENTA","PETKM","PETUN","PGSUS","PINSU","PKART","PKENT","PLTUR","PNLSN","PNSUT","POLHO","POLTK","PRDGS","PRKAB","PRKME","PRZMA","PSDTC","PSGYO","QNBFK","QNBTR","QUAGR","RALYH","RAYSG","REEDR","RGYAS","RNPOL","RODRG","RTALB","RUBNS","RUZYE","RYGYO","RYSAS","SAFKR","SAHOL","SAMAT","SANEL","SANFM","SANKO","SARKY","SASA","SAYAS","SDTTR","SEGMN","SEGYO","SEKFK","SEKUR","SELEC","SELVA","SERNT","SEYKM","SILVR","SISE","SKBNK","SKTAS","SKYLP","SKYMD","SMART","SMRTG","SMRVA","SNGYO","SNICA","SNPAM","SODSN","SOHOE","SOKE","SOKM","SONME","SRVGY","SUMAS","SUNTK","SURGY","SUWEN","SVGYO","TABGD","TARKM","TATEN","TATGD","TAVHL","TBORG","TCELL","TCKRC","TDGYO","TEHOL","TEKTU","TERA","TEZOL","TGSAS","THYAO","TKFEN","TKNSA","TLMAN","TMPOL","TMSN","TNZTP","TOASO","TRALT","TRCAS","TRENJ","TRGYO","TRHOL","TRILC","TRMET","TSGYO","TSKB","TSPOR","TTKOM","TTRAK","TUCLK","TUKAS","TUPRS","TUREX","TURGG","TURSG","UCAYM","UFUK","ULAS","ULKER","ULUFA","ULUSE","ULUUN","UNLU","USAK","VAKBN","VAKFA","VAKFN","VAKKO","VANGD","VBTYZ","VERTU","VERUS","VESBE","VESTL","VKFYO","VKGYO","VKING","VRGYO","VSNMD","YAPRK","YATAS","YAYLA","YBTAS","YEOTK","YESIL","YGGYO","YIGIT","YKBNK","YKSLN","YONGA","YUNSA","YYAPI","YYLGD","ZEDUR","ZERGY","ZGYO","ZOREN","ZRGYO"];

// Global & US Stocks + ETFs (NasDaq, S&P, Europe, Funds)
export const GLOBAL_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "NFLX", "AMD", "INTC", 
  "QCOM", "AVGO", "CSCO", "ADBE", "CRM", "PEP", "KO", "MCD", "NKE", "JPM", "BAC", "V", "MA",
  "ASML", "SAP", "NVO", "LVMUY", "TTE", "SNY", "NVS", "BABA", "TSM",
  "SPY", "QQQ", "DIA", "IWM", "GLD", "SLV", "USO", "ARKK", "VTI", "VOO",
  "IBIT", "FBTC", "MSTR", "COIN"
];

function formatYfSymbol(sym: string): string {
  if (GLOBAL_SYMBOLS.includes(sym)) return sym;
  return sym.includes(".") ? sym : `${sym}.IS`;
}

// Toplu veri çekme (batch) — 50'li gruplar halinde
async function fetchBatch(symbols: string[], batchSize = 50): Promise<StockData[]> {
  const results: StockData[] = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(async (sym) => {
        const yfSym = formatYfSymbol(sym);
        const result = await yfFetch(yfSym);
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
  .validator((input: unknown) => {
    const obj = input as { limit?: number };
    return { limit: obj?.limit || 0 };
  })
  .handler(async ({ data }) => {
    const all = await fetchBatch(BIST_SYMBOLS);
    return data.limit > 0 ? all.slice(0, data.limit) : all;
  });

export const fetchSingleStock = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const obj = input as { symbol?: string };
    return { symbol: (obj?.symbol || "THYAO").toUpperCase() };
  })
  .handler(async ({ data }) => {
    const result = await yfFetch(formatYfSymbol(data.symbol));
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
      const result = await yfFetch(formatYfSymbol(data.symbol), data.range);
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
    } catch (e) {
      console.warn("fetchHistory error:", data.symbol, e);
      return [];
    }
  });

// ─── News (RSS -> JSON proxy) ──────────────────────────────────────────────

type NewsItem = {
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
  .validator((input: unknown) => {
    const obj = input as { symbol?: string };
    return { symbol: (obj?.symbol || "").toUpperCase() };
  })
  .handler(async ({ data }) => {
    try {
      const queries = ["borsa piyasa", "bist hisse", "türkiye ekonomi"];
      if (data.symbol) {
        queries.unshift(`${data.symbol} hisse`);
      }
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
        } catch (e) { console.warn("News fetch error:", e); }
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
    } catch (e) {
      console.warn("fetchNews error:", e);
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

type CalendarEvent = {
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
    } catch (e) {
      console.warn("fetchCalendar error:", e);
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

// ─── AI Engine Integration ──────────────────────────────────────────────────

import { runAIEngine, runSimpleTechnicalEngine } from "./ml.engine";

// Fetch history and run ML engine for a single stock
export const fetchSingleAiAnalysis = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const obj = input as { symbol?: string; dataCount?: number };
    return { 
      symbol: (obj?.symbol || "THYAO").toUpperCase(),
      dataCount: obj?.dataCount || 252
    };
  })
  .handler(async ({ data }) => {
    try {
      // Fetch maximum available data (e.g. 5y) to ensure we can slice up to dataCount (max ~1250 days)
      const result = await yfFetch(formatYfSymbol(data.symbol), "5y");
      if (!result?.timestamp || !result?.indicators?.quote?.[0]) return null;
      
      const quotes = result.indicators.quote[0];
      const history = result.timestamp.map((ts: number, i: number) => ({
        close: quotes.close[i],
        volume: quotes.volume[i],
      })).filter((h: any) => h.close != null);

      if (history.length < 30) return null;
      
      const analysis = await runAIEngine(history, data.symbol, data.dataCount);
      return { symbol: data.symbol, analysis };
    } catch (e) {
      console.warn("fetchSingleAiAnalysis error:", data.symbol, e);
      return null;
    }
  });

// Fetch history and run Simple Technical Engine for all symbols (AL/SAT only)
// Limit to top 100 BIST symbols + global to reduce API load
export const fetchTechnicalSignals = createServerFn({ method: "GET" })
  .validator(() => ({}))
  .handler(async () => {
    const bist = BIST_SYMBOLS.slice(0, 100).map((s) => `${s}.IS`);
    const allSymbols = Array.from(new Set([...bist, ...GLOBAL_SYMBOLS]));
    const results = [];
    
    // Batch fetch (30 at a time)
    for (let i = 0; i < allSymbols.length; i += 30) {
      const batch = allSymbols.slice(i, i + 30);
      try {
        const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${batch.join(",")}&range=3mo&interval=1d`;
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        
        if (res.ok) {
          const json = await res.json();
          if (json.spark && json.spark.result) {
            for (const symResult of json.spark.result) {
              const rawSymbol = symResult.symbol;
              const sym = rawSymbol.replace(".IS", ""); // Display without suffix
              
              const resp = symResult.response?.[0];
              if (!resp?.timestamp || !resp?.indicators?.quote?.[0]?.close) continue;
              
              const closes = resp.indicators.quote[0].close as number[];
              const history = closes.map(c => ({ close: c })).filter(h => h.close != null);
              
              if (history.length < 30) continue;
              
              const analysis = runSimpleTechnicalEngine(history, sym);
              
              // Return ONLY "AL" and "SAT" signals
              if (analysis.decision === "AL" || analysis.decision === "SAT") {
                results.push({ symbol: sym, analysis });
              }
            }
          }
        }
      } catch (e) {
        // Ignore batch errors and continue
      }
    }
    
    // Sort by highest score first
    results.sort((a, b) => b.analysis.rawScore - a.analysis.rawScore);
    
    return results;
  });

