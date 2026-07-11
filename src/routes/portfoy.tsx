import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { usePortfolio } from "@/lib/storage";
import { useServerFn } from "@tanstack/react-start";
import { fetchSingleStock, fetchStockHistory } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Plus, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { SECTOR_MAP } from "@/lib/market-data";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { calcVolatility } from "@/lib/ml.engine";

export const Route = createFileRoute("/portfoy")({
  head: () => ({
    meta: [
      { title: "Portföyüm — stockbear" },
      { name: "description", content: "Portföyünüzü takip edin, kâr/zarar analizi yapın, sektör dağılımı görüntüleyin." },
      { property: "og:title", content: "Portföyüm — stockbear" },
    ],
  }),
  component: PortfoyPage,
});

const PIE_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

function PortfoyPage() {
  const { items, add, remove } = usePortfolio();
  const [form, setForm] = useState({ symbol: "", lots: "", avgPrice: "" });
  const fetchSingle = useServerFn(fetchSingleStock);

  const { data: livePrices = {} } = useQuery({
    queryKey: ["portfolio-prices", items.map((i) => i.symbol).join(",")],
    queryFn: async () => {
      try {
        const prices: Record<string, number> = {};
        for (const item of items) {
          try {
            const result = await fetchSingle({ data: { symbol: item.symbol } });
            if (result?.price) prices[item.symbol] = result.price;
          } catch (e) { console.warn("Fiyat alınamadı:", item.symbol, e); }
        }
        return prices;
      } catch (e) { console.error("Portföy fiyat hatası:", e); return {} as Record<string, number>; }
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
    throwOnError: false,
  });

  const fetchHistory = useServerFn(fetchStockHistory);
  const { data: histories = {} } = useQuery({
    queryKey: ["portfolio-histories", items.map((i) => i.symbol).join(",")],
    queryFn: async () => {
      const result: Record<string, number[]> = {};
      for (const item of items) {
        try {
          const h = await fetchHistory({ data: { symbol: item.symbol, range: "3mo" } });
          if (h && h.length > 0) result[item.symbol] = h.map((d: { close: number }) => d.close);
        } catch {}
      }
      return result;
    },
    staleTime: 300_000,
    throwOnError: false,
  });

  const rows = useMemo(() => items.map((it) => {
    const livePrice = livePrices[it.symbol];
    const price = livePrice || it.avgPrice;
    const value = price * it.lots;
    const cost = it.avgPrice * it.lots;
    const pl = value - cost;
    const plPct = (pl / cost) * 100;
    return { ...it, price, value, cost, pl, plPct, hasLivePrice: !!livePrice };
  }), [items, livePrices]);

  const totals = rows.reduce((acc, r) => ({ value: acc.value + r.value, cost: acc.cost + r.cost, pl: acc.pl + r.pl }), { value: 0, cost: 0, pl: 0 });
  const totalPct = totals.cost > 0 ? (totals.pl / totals.cost) * 100 : 0;

  const sectorData = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach(r => {
      const sector = SECTOR_MAP[r.symbol] || "Diğer";
      map[sector] = (map[sector] || 0) + r.value;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [rows]);

  const riskMetrics = useMemo(() => {
    if (rows.length === 0) return null;
    const totalValue = rows.reduce((s, r) => s + r.value, 0);
    const weights = rows.map(r => r.value / totalValue);
    const volatilities = rows.map(r => {
      const closes = histories[r.symbol];
      return closes && closes.length > 10 ? calcVolatility(closes) : 20;
    });
    const portfolioVolatility = weights.reduce((s, w, i) => s + w * volatilities[i], 0);
    const riskFreeRate = 5;
    const sharpeRatio = (totalPct - riskFreeRate) / (portfolioVolatility || 1);
    const maxPos = rows.reduce((max, r) => r.value > max.value ? r : max, rows[0]);
    return { portfolioVolatility, sharpeRatio, maxPos };
  }, [rows, totalPct, histories]);

  const { data: bistHistory = [] } = useQuery({
    queryKey: ["bist100-history"],
    queryFn: async () => {
      try {
        const h = await fetchHistory({ data: { symbol: "XU100.IS", range: "1mo" } });
        return h ?? [];
      } catch { return []; }
    },
    staleTime: 300_000,
    throwOnError: false,
  });

  const benchmarkDiff = useMemo(() => {
    if (bistHistory.length < 2) return 0;
    const first = bistHistory[0]?.close || 0;
    const last = bistHistory[bistHistory.length - 1]?.close || 0;
    if (first === 0) return 0;
    const bistReturn = ((last - first) / first) * 100;
    return +((totalPct - bistReturn)).toFixed(2);
  }, [bistHistory, totalPct]);

  const exportCsv = () => {
    const header = "Hisse,Adet,Ort. Maliyet,Güncel Fiyat,Değer,K/Z,K/Z %\n";
    const rows_csv = rows.map(r =>
      `${r.symbol},${r.lots},${r.avgPrice.toFixed(2)},${r.price.toFixed(2)},${r.value.toFixed(0)},${r.pl.toFixed(0)},${r.plPct.toFixed(2)}`
    ).join("\n");
    const total = `\nToplam,,,,${totals.value.toFixed(0)},${totals.pl.toFixed(0)},${totalPct.toFixed(2)}`;
    const blob = new Blob([header + rows_csv + total], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfoy-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = Number(form.lots), avg = Number(form.avgPrice);
    if (!form.symbol || !lots || !avg) return;
    add({ symbol: form.symbol.toUpperCase(), lots, avgPrice: avg });
    setForm({ symbol: "", lots: "", avgPrice: "" });
  };

  return (
    <AppShell>
      <PageHeader
        title="Portföyüm"
        subtitle="Pozisyonlarınızı takip edin, kâr/zarar analizi yapın."
        action={
          rows.length > 0 ? (
            <button onClick={exportCsv} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40">
              <Download className="w-4 h-4" /> CSV İndir
            </button>
          ) : undefined
        }
      />

      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Toplam Değer</div><div className="text-2xl font-bold mt-1">{totals.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Maliyet</div><div className="text-2xl font-bold mt-1">{totals.cost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Kâr / Zarar</div><div className={`text-2xl font-bold mt-1 ${totals.pl >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>{totals.pl >= 0 ? "+" : ""}{totals.pl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Getiri</div><div className={`text-2xl font-bold mt-1 ${totalPct >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>{totalPct >= 0 ? "+" : ""}{totalPct.toFixed(2)}%</div></div>
      </div>

      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground">Hisse (Örn: THYAO)</label>
          <input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm uppercase" />
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-muted-foreground">Adet</label>
          <input type="number" value={form.lots} onChange={(e) => setForm({ ...form, lots: e.target.value })} className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-muted-foreground">Ort. Maliyet (TL)</label>
          <input type="number" step="0.01" value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Pozisyon Ekle
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left p-3 font-normal">Hisse</th>
              <th className="text-right font-normal">Adet</th>
              <th className="text-right font-normal">Ort. Maliyet</th>
              <th className="text-right font-normal">Güncel Fiyat</th>
              <th className="text-right font-normal">Değer</th>
              <th className="text-right font-normal">K/Z</th>
              <th className="text-right font-normal pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="border-b border-border hover:bg-secondary/40">
                <td className="p-3">
                  <Link to="/analiz" search={{ symbol: r.symbol }} className="font-semibold hover:text-primary">{r.symbol}</Link>
                </td>
                <td className="text-right">{r.lots}</td>
                <td className="text-right">{r.avgPrice.toFixed(2)} TL</td>
                <td className="text-right">
                  <span className={r.hasLivePrice ? "" : "text-muted-foreground"}>
                    {r.price.toFixed(2)} TL
                  </span>
                  {r.hasLivePrice && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[color:var(--success)] inline-block" />}
                </td>
                <td className="text-right font-medium">{r.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</td>
                <td className={`text-right ${r.pl >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>{r.pl >= 0 ? "+" : ""}{r.pl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL <span className="text-xs">({r.plPct >= 0 ? "+" : ""}{r.plPct.toFixed(2)}%)</span></td>
                <td className="text-right pr-3"><button onClick={() => remove(r.symbol)} className="text-muted-foreground hover:text-destructive" aria-label={`${r.symbol} pozisyonunu kaldır`}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">Portföyünüz boş. Yukarıdan pozisyon ekleyin.</td></tr>}
          </tbody>
        </table>
        </div>
      </div>

      {rows.length > 0 && (
        <>
          {/* Sektör Dağılımı */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold mb-4">Sektör Dağılımı</h2>
            <div className="h-[300px]">
              <PieChart width={500} height={280}>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sectorData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " TL"} />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Risk Metrikleri */}
          {riskMetrics && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold mb-4">Risk Metrikleri</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-border bg-secondary/40 p-4">
                  <div className="text-xs text-muted-foreground">Portföy Volatilitesi</div>
                  <div className="text-xl font-bold mt-1">%{riskMetrics.portfolioVolatility.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4">
                  <div className="text-xs text-muted-foreground">Sharpe Oranı</div>
                  <div className="text-xl font-bold mt-1">{riskMetrics.sharpeRatio.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4">
                  <div className="text-xs text-muted-foreground">Toplam Pozisyon Sayısı</div>
                  <div className="text-xl font-bold mt-1">{rows.length}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4">
                  <div className="text-xs text-muted-foreground">En Büyük Pozisyon</div>
                  <div className="text-xl font-bold mt-1">{riskMetrics.maxPos.symbol}</div>
                  <div className="text-xs text-muted-foreground mt-1">{riskMetrics.maxPos.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div>
                </div>
              </div>
            </div>
          )}

          {/* Benchmark */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold mb-2">Benchmark Karşılaştırması</h2>
            <p className={`text-base ${benchmarkDiff > 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
              Portföyünüz son 30 günde BIST100'ü {benchmarkDiff > 0 ? "+" : ""}{benchmarkDiff}% {benchmarkDiff > 0 ? "yendi" : "geride bıraktı"}
            </p>
          </div>
        </>
      )}
    </AppShell>
  );
}
