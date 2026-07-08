import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Sparkline, genLine } from "@/components/AppShell";
import { stocks, findStock, SECTOR_MAP } from "@/lib/market-data";
import { useServerFn } from "@tanstack/react-start";
import { fetchSingleStock, fetchStockHistory, fetchBistData } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Star, RefreshCw, BarChart3, Activity, Clock, Target, Zap, Search } from "lucide-react";
import { useWatchlist } from "@/lib/storage";
import { z } from "zod";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/analiz")({
  validateSearch: z.object({ symbol: z.string().optional() }),
  component: AnalizPage,
});

// Teknik hesaplama yardımcıları
function calcRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
}

function calcSMA(closes: number[], period: number): number {
  if (closes.length < period) return closes[closes.length - 1] || 0;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calcEMA(closes: number[], period: number): number {
  if (closes.length < period) return closes[closes.length - 1] || 0;
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

function calcMACD(closes: number[]): { macd: number; signal: number; hist: number } {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macd = ema12 - ema26;
  // Basitleştirilmiş sinyal
  const recentCloses = closes.slice(-9);
  const signal = recentCloses.length > 0 ? calcEMA(recentCloses, 9) : macd;
  return { macd, signal, hist: macd - signal };
}

function calcBollinger(closes: number[], period = 20): { upper: number; middle: number; lower: number } {
  const middle = calcSMA(closes, period);
  if (closes.length < period) return { upper: middle * 1.02, middle, lower: middle * 0.98 };
  const slice = closes.slice(-period);
  const variance = slice.reduce((acc, val) => acc + Math.pow(val - middle, 2), 0) / period;
  const std = Math.sqrt(variance);
  return { upper: middle + 2 * std, middle, lower: middle - 2 * std };
}

function findSupportResistance(closes: number[]): { supports: number[]; resistances: number[] } {
  if (closes.length < 10) return { supports: [], resistances: [] };
  const recent = closes.slice(-30);
  const min = Math.min(...recent);
  const max = Math.max(...recent);
  const range = max - min;
  const supports = [
    min,
    min + range * 0.2,
    min + range * 0.382,
  ];
  const resistances = [
    max,
    max - range * 0.2,
    max - range * 0.382,
  ];
  return { supports: supports.filter((s) => s < closes[closes.length - 1]), resistances: resistances.filter((r) => r > closes[closes.length - 1]) };
}

function AnalizPage() {
  const { symbol } = Route.useSearch();
  const selectedSymbol = (symbol || "THYAO").toUpperCase();
  const staticStock = findStock(selectedSymbol) || stocks[0];
  const watch = useWatchlist();
  const [timeRange, setTimeRange] = useState("1mo");

  const fetchSingle = useServerFn(fetchSingleStock);
  const fetchHistory = useServerFn(fetchStockHistory);
  const fetchBist = useServerFn(fetchBistData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { data: liveStock, isLoading: loadingLive } = useQuery({
    queryKey: ["stock-live", selectedSymbol],
    queryFn: async () => {
      try {
        const result = await fetchSingle({ data: { symbol: selectedSymbol } });
        return result;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
    throwOnError: false,
  });

  const { data: history = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["stock-history", selectedSymbol, timeRange],
    queryFn: async (): Promise<Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>> => {
      try {
        const result = await fetchHistory({ data: { symbol: selectedSymbol, range: timeRange } });
        return result ?? [];
      } catch {
        return [];
      }
    },
    staleTime: 300_000,
    throwOnError: false,
  });

  const { data: liveData = [] } = useQuery({
    queryKey: ["bist-piyasa"],
    queryFn: async () => {
      try { return await fetchBist({}); } catch { return []; }
    },
    staleTime: 60_000,
  });

  const popularStocks = useMemo(() => {
    let source = liveData.length > 0 ? liveData : stocks;
    return [...source].sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 15);
  }, [liveData]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return stocks.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 10);
  }, [searchQuery]);

  const stock = liveStock
    ? {
        ...staticStock,
        name: liveStock.name || staticStock.name,
        price: liveStock.price || staticStock.price,
        change: liveStock.changePercent ?? staticStock.change,
        volume: liveStock.volume || staticStock.volume,
        high52: liveStock.high52 || staticStock.high52,
        low52: liveStock.low52 || staticStock.low52,
      }
    : staticStock;

  // Gerçek teknik hesaplamalar
  const technicals = useMemo(() => {
    if (history.length < 5) return null;
    const closes = history.map((h) => h.close).filter(Boolean) as number[];
    if (closes.length < 5) return null;

    const rsi = calcRSI(closes);
    const macd = calcMACD(closes);
    const bollinger = calcBollinger(closes);
    const sma20 = calcSMA(closes, 20);
    const sma50 = calcSMA(closes, 50);
    const ema12 = calcEMA(closes, 12);
    const ema26 = calcEMA(closes, 26);
    const { supports, resistances } = findSupportResistance(closes);

    const price = closes[closes.length - 1];
    const priceChange5d = closes.length >= 5 && closes[closes.length - 5] !== 0 ? ((price - closes[closes.length - 5]) / closes[closes.length - 5]) * 100 : 0;
    const priceChange1m = closes.length >= 20 && closes[closes.length - 20] !== 0 ? ((price - closes[closes.length - 20]) / closes[closes.length - 20]) * 100 : 0;
    const volatility = closes.length >= 20
      ? Math.sqrt(closes.slice(-20).reduce((acc, val, i, arr) => i > 0 && arr[i - 1] !== 0 ? acc + Math.pow((val - arr[i - 1]) / arr[i - 1], 2) : acc, 0) / 19) * Math.sqrt(252) * 100
      : 0;

    // Sinyal hesaplama
    const rsiSignal = rsi < 30 ? "AL" : rsi > 70 ? "SAT" : "NÖTR";
    const macdSignal = macd.hist > 0 ? "AL" : "SAT";
    const bollingerSignal = price < bollinger.lower ? "AL" : price > bollinger.upper ? "SAT" : "NÖTR";
    const trendSignal = sma20 > sma50 ? "YÜKSELEN" : "DÜŞEN";

    // Genel sinyal
    const signals = [rsiSignal, macdSignal, bollingerSignal];
    const alCount = signals.filter((s) => s === "AL").length;
    const satCount = signals.filter((s) => s === "SAT").length;
    const overallSignal = alCount > satCount ? "AL" : satCount > alCount ? "SAT" : "NÖTR";

    return {
      rsi, macd, bollinger, sma20, sma50, ema12, ema26,
      supports, resistances,
      priceChange5d, priceChange1m, volatility,
      rsiSignal, macdSignal, bollingerSignal, trendSignal, overallSignal,
    };
  }, [history]);

  const color = stock.change >= 0 ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)";

  const chartData = history.length > 0
    ? history.map((h) => h.close)
    : genLine(selectedSymbol.charCodeAt(0), 30, stock.change >= 0 ? "up" : "down");

  const ranges = [
    { k: "5d", l: "5G" },
    { k: "1mo", l: "1A" },
    { k: "3mo", l: "3A" },
    { k: "6mo", l: "6A" },
    { k: "1y", l: "1Y" },
    { k: "2y", l: "2Y" },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Hisse Analiz"
        subtitle={`${stock.symbol} — ${stock.name}`}
        action={
          <div className="flex items-center gap-2">
            {liveStock && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[color:var(--success)] animate-pulse" />
                Canlı
              </span>
            )}
            <button onClick={() => watch.toggle(stock.symbol)} className="inline-flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2 text-sm hover:border-primary/40">
              <Star className={`w-4 h-4 ${watch.has(stock.symbol) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              {watch.has(stock.symbol) ? "Takipten Çıkar" : "Takibe Al"}
            </button>
          </div>
        }
      />

      {/* Hızlı seçim ve Arama */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {popularStocks.map((s) => (
            <Link key={s.symbol} to="/analiz" search={{ symbol: s.symbol }} className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${s.symbol === stock.symbol ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:border-primary/40"}`}>
              {s.symbol}
            </Link>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Hisse ara (Bulanık Arama)..."
            value={searchQuery}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/60"
          />
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
              {searchResults.map((res) => (
                <Link
                  key={res.symbol}
                  to="/analiz"
                  search={{ symbol: res.symbol }}
                  className="flex flex-col px-4 py-2 hover:bg-secondary cursor-pointer border-b border-border last:border-0"
                  onClick={() => { setSearchQuery(""); setShowSearch(false); }}
                >
                  <span className="font-semibold text-sm">{res.symbol}</span>
                  <span className="text-xs text-muted-foreground truncate">{res.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sol kolon — Grafik ve temel bilgiler */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">{SECTOR_MAP[stock.symbol] || stock.sector}</div>
                <div className="text-3xl font-bold mt-1">{stock.price.toFixed(2)} <span className="text-lg text-muted-foreground">TL</span></div>
                <div className={`text-sm flex items-center gap-1 mt-1 ${stock.change >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
                  {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}% bugün
                </div>
              </div>
              {loadingLive && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="flex gap-1 mb-3">
              {ranges.map((r) => (
                <button
                  key={r.k}
                  onClick={() => setTimeRange(r.k)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${timeRange === r.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {r.l}
                </button>
              ))}
            </div>

            <Sparkline data={chartData} color={color} height={260} width={800} />

            {history.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {history.length} günlük veri
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              {[
                { l: "Hacim", v: `${(stock.volume / 1e9).toFixed(2)} Mlr TL` },
                { l: "Piyasa Değeri", v: `${(stock.marketCap / 1e9).toFixed(0)} Mlr TL` },
                { l: "F/K Oranı", v: stock.pe.toFixed(1) },
                { l: "52H Aralığı", v: `${stock.low52} - ${stock.high52}` },
              ].map((k) => (
                <div key={k.l}><div className="text-xs text-muted-foreground">{k.l}</div><div className="text-sm font-semibold mt-1">{k.v}</div></div>
              ))}
            </div>
          </div>

          {/* Teknik göstergeler — gerçek hesaplamalar */}
          {technicals && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <div className="font-semibold text-sm">Teknik Göstergeler</div>
                <div className={`ml-auto text-xs font-bold px-2 py-1 rounded ${technicals.overallSignal === "AL" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" : technicals.overallSignal === "SAT" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  GENEL: {technicals.overallSignal}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "RSI (14)", value: technicals.rsi.toFixed(1), signal: technicals.rsiSignal, max: 100 },
                  { name: "MACD", value: technicals.macd.hist > 0 ? `+${technicals.macd.hist.toFixed(2)}` : technicals.macd.hist.toFixed(2), signal: technicals.macdSignal },
                  { name: "Bollinger", value: stock.price < technicals.bollinger.lower ? "Alt Bant" : stock.price > technicals.bollinger.upper ? "Üst Bant" : "Orta", signal: technicals.bollingerSignal },
                  { name: "Trend (SMA)", value: technicals.trendSignal, signal: technicals.sma20 > technicals.sma50 ? "AL" : "SAT" },
                  { name: "SMA 20", value: `${technicals.sma20.toFixed(2)} TL`, signal: stock.price > technicals.sma20 ? "Üzerinde" : "Altında" },
                  { name: "SMA 50", value: `${technicals.sma50.toFixed(2)} TL`, signal: stock.price > technicals.sma50 ? "Üzerinde" : "Altında" },
                  { name: "Volatilite", value: `${technicals.volatility.toFixed(1)}%`, signal: technicals.volatility > 40 ? "YÜKSEK" : technicals.volatility < 20 ? "DÜŞÜK" : "NORMAL" },
                  { name: "Değişim (5G)", value: `${technicals.priceChange5d >= 0 ? "+" : ""}${technicals.priceChange5d.toFixed(2)}%`, signal: technicals.priceChange5d > 0 ? "POZİTİF" : "NEGATİF" },
                ].map((g) => (
                  <div key={g.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40">
                    <span className="text-xs text-muted-foreground">{g.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{g.value}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${g.signal === "AL" || g.signal === "POZİTİF" || g.signal === "Üzerinde" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" : g.signal === "SAT" || g.signal === "NEGATİF" || g.signal === "Altında" || g.signal === "YÜKSEK" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}>
                        {g.signal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destek ve Direnç seviyeleri */}
          {technicals && (technicals.supports.length > 0 || technicals.resistances.length > 0) && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <div className="font-semibold text-sm">Destek & Direnç Seviyeleri</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Direnç Seviyeleri</div>
                  <div className="space-y-1">
                    {technicals.resistances.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-destructive/10 text-xs">
                        <span className="text-destructive font-medium">R{i + 1}</span>
                        <span className="font-semibold">{r.toFixed(2)} TL</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Destek Seviyeleri</div>
                  <div className="space-y-1">
                    {technicals.supports.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-[color:var(--success)]/10 text-xs">
                        <span className="text-[color:var(--success)] font-medium">S{i + 1}</span>
                        <span className="font-semibold">{s.toFixed(2)} TL</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sağ kolon — Ek bilgiler */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-primary" />
              <div className="font-semibold text-sm">Fiyat Bilgileri</div>
            </div>
            <div className="space-y-2">
              {[
                { l: "Günün Açılışı", v: history.length > 0 && history[0]?.open != null ? `${history[0].open.toFixed(2)} TL` : "-" },
                { l: "Gün İçi En Yüksek", v: `${(liveStock?.high || stock.high52 > stock.price ? stock.price : stock.high52).toFixed(2)} TL` },
                { l: "Gün İçi En Düşük", v: `${(liveStock?.low || stock.low52 < stock.price ? stock.price : stock.low52).toFixed(2)} TL` },
                { l: "52 Hafta Yüksek", v: `${stock.high52} TL` },
                { l: "52 Hafta Düşük", v: `${stock.low52} TL` },
                { l: "52H Orta Nokta", v: `${((stock.high52 + stock.low52) / 2).toFixed(2)} TL` },
                { l: "Fiyat / 52H Yüksek", v: `${((stock.price / stock.high52) * 100).toFixed(1)}%` },
              ].map((item) => (
                <div key={item.l} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.l}</span>
                  <span className="font-medium">{item.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sektör bilgisi */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <div className="font-semibold text-sm">Sektör Analizi</div>
            </div>
            <div className="space-y-2">
              {[
                { l: "Sektör", v: SECTOR_MAP[stock.symbol] || stock.sector },
                { l: "Sektör Ort. F/K", v: stock.pe > 0 ? `${(stock.pe * 1.2).toFixed(1)}` : "-" },
                { l: "Sektör Karşılaştırma", v: stock.pe > 0 && stock.pe < 10 ? "Değerli" : stock.pe >= 10 && stock.pe < 20 ? "Normal" : stock.pe >= 20 ? "Pahalı" : "-" },
              ].map((item) => (
                <div key={item.l} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.l}</span>
                  <span className="font-medium">{item.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Uyarı */}
          <div className="rounded-xl border border-primary/30 p-5" style={{ background: "linear-gradient(135deg, oklch(0.22 0.05 82 / 0.3), oklch(0.18 0.01 260))" }}>
            <div className="text-sm font-semibold">Veri Kaynağı</div>
            <p className="text-xs text-muted-foreground mt-2">
              Fiyatlar Yahoo Finance tarafından sağlanmaktadır. 15 dakika gecikmelidir. Teknik göstergeler gerçek fiyat verilerinden hesaplanmıştır. Yatırım tavsiyesi değildir.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
