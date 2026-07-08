import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Sparkline, genLine } from "@/components/AppShell";
import { stocks, findStock } from "@/lib/market-data";
import { useWatchlist } from "@/lib/storage";
import { useServerFn } from "@tanstack/react-start";
import { fetchSingleStock, fetchStockHistory } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { Star, Plus, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/takip")({ component: TakipPage });

function TakipPage() {
  const { list, toggle } = useWatchlist();
  const [showAdd, setShowAdd] = useState(false);
  const fetchSingle = useServerFn(fetchSingleStock);

  const { data: livePrices = {} } = useQuery({
    queryKey: ["watchlist-prices", list.join(",")],
    queryFn: async () => {
      try {
        const prices: Record<string, { price: number; changePercent: number; volume: number; high: number; low: number }> = {};
        for (const sym of list) {
          try {
            const result = await fetchSingle({ data: { symbol: sym } });
            if (result?.price) {
              const prevClose = (result as unknown as { prevClose?: number }).prevClose;
              prices[sym] = {
                price: result.price,
                changePercent: prevClose ? ((result.price - prevClose) / prevClose) * 100 : 0,
                volume: result.volume || 0,
                high: result.high || 0,
                low: result.low || 0,
              };
            }
          } catch {}
        }
        return prices;
      } catch {
        return {} as Record<string, { price: number; changePercent: number; volume: number; high: number; low: number }>;
      }
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
    throwOnError: false,
  });

  const fetchHistory = useServerFn(fetchStockHistory);
  const { data: sparklineData = {} } = useQuery({
    queryKey: ["watchlist-sparklines", list.join(",")],
    queryFn: async () => {
      const data: Record<string, number[]> = {};
      for (const sym of list) {
        try {
          const result = await fetchHistory({ data: { symbol: sym, range: "3mo" } });
          if (result && result.length > 0) {
            data[sym] = result.map((h: any) => h.close).filter(Boolean);
          }
        } catch {}
      }
      return data;
    },
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });

  const items = list.map((sym) => {
    const staticStock = findStock(sym);
    const live = livePrices[sym];
    return {
      symbol: sym,
      name: staticStock?.name || sym,
      sector: staticStock?.sector || "Diğer",
      price: live?.price || staticStock?.price || 0,
      changePercent: live?.changePercent || staticStock?.change || 0,
      volume: live?.volume || staticStock?.volume || 0,
      pe: staticStock?.pe || 0,
      hasLivePrice: !!live,
    };
  });

  const notAdded = stocks.filter((s) => !list.includes(s.symbol));

  return (
    <AppShell>
      <PageHeader
        title="Takip Listem"
        subtitle="Favori hisselerinizi buradan izleyin."
        action={<button onClick={() => setShowAdd(!showAdd)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90"><Plus className="w-4 h-4" /> Hisse Ekle</button>}
      />

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold mb-3">Hisse Ekle</div>
          <div className="flex flex-wrap gap-2">
            {notAdded.map((s) => (
              <button key={s.symbol} onClick={() => toggle(s.symbol)} className="text-xs bg-secondary border border-border rounded-full px-3 py-1.5 hover:border-primary/40">
                + {s.symbol}
              </button>
            ))}
            {notAdded.length === 0 && <div className="text-sm text-muted-foreground">Tüm hisseler eklendi.</div>}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.symbol} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <Link to="/analiz" search={{ symbol: s.symbol }} className="font-bold text-lg hover:text-primary">{s.symbol}</Link>
                <div className="text-xs text-muted-foreground">{s.name}</div>
              </div>
              <button onClick={() => toggle(s.symbol)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-2xl font-bold">{s.price.toFixed(2)} TL</div>
              <div className={`text-sm ${s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
                {s.changePercent >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
              </div>
              {s.hasLivePrice && <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] inline-block" />}
            </div>
            <div className="mt-3">
              <Sparkline
                data={sparklineData[s.symbol] && sparklineData[s.symbol].length > 5 ? sparklineData[s.symbol] : genLine(s.symbol.charCodeAt(0), 30, s.changePercent >= 0 ? "up" : "down")}
                color={s.changePercent >= 0 ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)"}
                height={60}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              <span>Hacim: {(s.volume / 1e9).toFixed(1)} Mlr</span>
              <span>F/K: {s.pe.toFixed(1)}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Star className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Takip listeniz boş. Yukarıdan hisse ekleyin.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
