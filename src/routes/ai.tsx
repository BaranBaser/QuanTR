import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Sparkline, genLine } from "@/components/AppShell";
import { useServerFn } from "@tanstack/react-start";
import { fetchBistData } from "@/lib/ai.functions";
import { stocks } from "@/lib/market-data";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, Activity, Zap } from "lucide-react";
import type { StockData } from "@/lib/ai.functions";

type DisplayItem = {
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
  marketCap: number;
  pe: number;
};

export const Route = createFileRoute("/ai")({ component: MarketAnalysisPage });

function MarketAnalysisPage() {
  const fetchFn = useServerFn(fetchBistData);

  const { data: liveData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["bist-live"],
    queryFn: async () => {
      try { return await fetchFn({}); } catch { return []; }
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
    throwOnError: false,
  });

  const displayData: DisplayItem[] = liveData && liveData.length > 0
    ? liveData.map((d: StockData) => ({
        ...d,
        change: d.change,
        changePercent: d.changePercent,
        sector: stocks.find((s) => s.symbol === d.symbol)?.sector || d.sector || "Diğer",
        marketCap: stocks.find((s) => s.symbol === d.symbol)?.marketCap || 0,
        pe: stocks.find((s) => s.symbol === d.symbol)?.pe || 0,
      }))
    : stocks.map((s) => ({
        ...s,
        change: s.change,
        changePercent: s.changePercent,
      }));

  const gainers = [...displayData].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...displayData].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const byVolume = [...displayData].sort((a, b) => b.volume - a.volume).slice(0, 5);

  const sectors = displayData.reduce((acc, s) => {
    const existing = acc.find((a) => a.name === s.sector);
    if (existing) {
      existing.stocks.push(s);
      existing.avgChange += s.changePercent;
    } else {
      acc.push({ name: s.sector, stocks: [s], avgChange: s.changePercent });
    }
    return acc;
  }, [] as { name: string; stocks: DisplayItem[]; avgChange: number }[]);

  return (
    <AppShell>
      <PageHeader
        title="Piyasa Analizi"
        subtitle="Canlı BIST verileri, en çok yükselenler, düşenler ve sektör analizi."
        action={
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Güncelleniyor..." : "Yenile"}
          </button>
        }
      />

      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="animate-pulse text-muted-foreground">Canlı veriler yükleniyor...</div>
          <p className="text-xs text-muted-foreground mt-2">Yahoo Finance'ten BIST verileri çekiliyor.</p>
        </div>
      )}

      {liveData && liveData.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Canlı veri alınamadı (piyasa kapalı olabilir). Mock veriler gösteriliyor.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[color:var(--success)]" />
            <h3 className="font-semibold text-sm">En Çok Yükselenler</h3>
          </div>
          <div className="space-y-3">
            {gainers.map((s) => (
              <Link key={s.symbol} to="/analiz" search={{ symbol: s.symbol }} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40">
                <div>
                  <div className="font-semibold text-sm">{s.symbol}</div>
                  <div className="text-xs text-muted-foreground">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{typeof s.price === "number" ? s.price.toFixed(2) : s.price} TL</div>
                  <div className="text-xs text-[color:var(--success)] font-semibold">
                    +{typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.change}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <h3 className="font-semibold text-sm">En Çok Düşenler</h3>
          </div>
          <div className="space-y-3">
            {losers.map((s) => (
              <Link key={s.symbol} to="/analiz" search={{ symbol: s.symbol }} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40">
                <div>
                  <div className="font-semibold text-sm">{s.symbol}</div>
                  <div className="text-xs text-muted-foreground">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{typeof s.price === "number" ? s.price.toFixed(2) : s.price} TL</div>
                  <div className="text-xs text-destructive font-semibold">
                    {typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.change}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">En Yüksek Hacim</h3>
          </div>
          <div className="space-y-3">
            {byVolume.map((s) => (
              <Link key={s.symbol} to="/analiz" search={{ symbol: s.symbol }} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40">
                <div>
                  <div className="font-semibold text-sm">{s.symbol}</div>
                  <div className="text-xs text-muted-foreground">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{typeof s.price === "number" ? s.price.toFixed(2) : s.price} TL</div>
                  <div className="text-xs text-muted-foreground">
                    {(s.volume / 1e9).toFixed(2)} Mlr
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Sektör Analizi</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((s) => (
            <div key={s.name} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{s.name}</span>
                <span className={`text-xs font-semibold ${s.avgChange >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
                  {s.avgChange >= 0 ? "+" : ""}{(s.avgChange / s.stocks.length).toFixed(2)}%
                </span>
              </div>
              <div className="space-y-1">
                {s.stocks.map((st) => (
                  <div key={st.symbol} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{st.symbol}</span>
                    <span className={st.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}>
                      {st.changePercent >= 0 ? "+" : ""}{typeof st.changePercent === "number" ? st.changePercent.toFixed(2) : st.change}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Tüm Hisseler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left p-3 font-normal">Hisse</th>
                <th className="text-left font-normal">Sektör</th>
                <th className="text-right font-normal">Fiyat</th>
                <th className="text-right font-normal">Değişim</th>
                <th className="text-right font-normal">Hacim</th>
                <th className="text-right font-normal pr-3">52H Aralığı</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((s) => (
                <tr key={s.symbol} className="border-b border-border hover:bg-secondary/40">
                  <td className="p-3">
                    <Link to="/analiz" search={{ symbol: s.symbol }} className="font-semibold hover:text-primary">{s.symbol}</Link>
                    <div className="text-xs text-muted-foreground">{s.name}</div>
                  </td>
                  <td className="text-muted-foreground">{s.sector}</td>
                  <td className="text-right font-medium">{typeof s.price === "number" ? s.price.toFixed(2) : s.price} TL</td>
                  <td className="text-right">
                    <span className={s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}>
                      {s.changePercent >= 0 ? "+" : ""}{typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.change}%
                    </span>
                  </td>
                  <td className="text-right text-muted-foreground">{(s.volume / 1e9).toFixed(2)} Mlr</td>
                  <td className="text-right pr-3 text-muted-foreground">{s.low52} - {s.high52}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-primary/30 p-5 flex flex-wrap items-center justify-between gap-4" style={{ background: "linear-gradient(90deg, oklch(0.22 0.05 82 / 0.5), oklch(0.18 0.01 260))" }}>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center"><Activity className="w-5 h-5 text-primary" /></div>
          <div>
            <div className="font-semibold">Detaylı Hisse Analizi</div>
            <p className="text-sm text-muted-foreground">Her hisse için teknik analiz ve grafikleri inceleyin.</p>
          </div>
        </div>
        <Link to="/analiz" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg px-5 py-3 hover:bg-primary/90">
          Analiz Sayfasına Git
        </Link>
      </div>
    </AppShell>
  );
}
