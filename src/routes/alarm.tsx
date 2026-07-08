import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAlarms } from "@/lib/storage";
import { useServerFn } from "@tanstack/react-start";
import { fetchSingleStock } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellOff, Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/alarm")({ component: AlarmPage });

function AlarmPage() {
  const { alarms, add, remove, toggle } = useAlarms();
  const [form, setForm] = useState({ symbol: "", type: "above" as "above" | "below", targetPrice: "" });
  const fetchSingle = useServerFn(fetchSingleStock);

  const { data: livePrices = {} } = useQuery({
    queryKey: ["alarm-prices", alarms.map((a) => a.symbol).join(",")],
    queryFn: async () => {
      try {
        const prices: Record<string, number> = {};
        const uniqueSymbols = [...new Set(alarms.map((a) => a.symbol))];
        for (const sym of uniqueSymbols) {
          try {
            const result = await fetchSingle({ data: { symbol: sym } });
            if (result?.price) prices[sym] = result.price;
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.targetPrice);
    if (!form.symbol || !price) return;
    add({ symbol: form.symbol.toUpperCase(), type: form.type, targetPrice: price, active: true });
    setForm({ symbol: "", type: "above", targetPrice: "" });
  };

  const activeAlarms = alarms.filter((a) => a.active);
  const inactiveAlarms = alarms.filter((a) => !a.active);

  return (
    <AppShell>
      <PageHeader
        title="Fiyat Alarmları"
        subtitle="Hisse fiyatlarını izleyin, hedef fiyatlara ulaştığında haberdar olun."
      />

      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground">Hisse</label>
          <input
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
            placeholder="Örn: THYAO"
            className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm uppercase"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground">Alarm Tipi</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "above" | "below" })}
            className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="above">Fiyat Üzerine Çıkarsa</option>
            <option value="below">Fiyat Altına Düşerse</option>
          </select>
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-muted-foreground">Hedef Fiyat (TL)</label>
          <input
            type="number"
            step="0.01"
            value={form.targetPrice}
            onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
            placeholder="0.00"
            className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Alarm Ekle
        </button>
      </form>

      {activeAlarms.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Aktif Alarmlar ({activeAlarms.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {activeAlarms.map((a) => {
              const livePrice = livePrices[a.symbol];
              const triggered = livePrice ? (a.type === "above" ? livePrice >= a.targetPrice : livePrice <= a.targetPrice) : false;
              return (
                <div key={a.id} className={`flex items-center justify-between px-4 py-3 hover:bg-secondary/40 ${triggered ? "bg-primary/5" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Link to="/analiz" search={{ symbol: a.symbol }} className="font-semibold hover:text-primary">{a.symbol}</Link>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${a.type === "above" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-destructive/10 text-destructive"}`}>
                      {a.type === "above" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {a.type === "above" ? "Üzeri" : "Altı"}
                    </span>
                    <span className="text-sm text-muted-foreground">{a.targetPrice.toFixed(2)} TL</span>
                    {triggered && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Tetiklendi!</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {livePrice && (
                      <span className={`text-sm font-medium ${livePrice >= a.targetPrice ? "text-[color:var(--success)]" : "text-destructive"}`}>
                        {livePrice.toFixed(2)} TL
                      </span>
                    )}
                    <button onClick={() => toggle(a.id)} className="text-muted-foreground hover:text-primary">
                      <BellOff className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inactiveAlarms.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden opacity-60">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
              <BellOff className="w-4 h-4" />
              Pasif Alarmlar ({inactiveAlarms.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {inactiveAlarms.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-muted-foreground">{a.symbol}</span>
                  <span className="text-xs text-muted-foreground">{a.type === "above" ? "Üzeri" : "Altı"} {a.targetPrice.toFixed(2)} TL</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(a.id)} className="text-muted-foreground hover:text-primary">
                    <Bell className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alarms.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Bell className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">Henüz alarm eklenmemiş. Yukarıdan bir hisse için alarm ekleyin.</p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
        Alarmlar localStorage'da saklanır. Canlı fiyatlar Yahoo Finance tarafından sağlanır.
      </div>
    </AppShell>
  );
}
