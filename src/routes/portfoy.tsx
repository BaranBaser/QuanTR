import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { usePortfolio } from "@/lib/storage";
import { useServerFn } from "@tanstack/react-start";
import { fetchSingleStock } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/portfoy")({ component: PortfoyPage });

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
          } catch {}
        }
        return prices;
      } catch {
        return {} as Record<string, number>;
      }
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = Number(form.lots), avg = Number(form.avgPrice);
    if (!form.symbol || !lots || !avg) return;
    add({ symbol: form.symbol.toUpperCase(), lots, avgPrice: avg });
    setForm({ symbol: "", lots: "", avgPrice: "" });
  };

  return (
    <AppShell>
      <PageHeader title="Portföyüm" subtitle="Pozisyonlarınızı takip edin, kâr/zarar analizi yapın." />

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
                <td className="text-right pr-3"><button onClick={() => remove(r.symbol)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">Portföyünüz boş. Yukarıdan pozisyon ekleyin.</td></tr>}
          </tbody>
        </table>
        </div>
      </div>
    </AppShell>
  );
}
