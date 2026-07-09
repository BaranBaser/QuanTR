import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Sparkline, genLine } from "@/components/AppShell";
import { stocks, findStock } from "@/lib/market-data";
import { Play, RotateCcw, Beaker } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export const Route = createFileRoute("/simulasyon")({
  head: () => ({
    meta: [
      { title: "Simülasyon — stockbear" },
      { name: "description", content: "Gerçek para riski olmadan alım-satım pratiği yapın." },
      { property: "og:title", content: "Simülasyon — stockbear" },
    ],
  }),
  component: SimPage,
});

type Trade = { day: number; symbol: string; type: "AL" | "SAT"; lots: number; price: number };

function SimPage() {
  const [balance, setBalance] = useState(100000);
  const [initialBalance] = useState(100000);
  const [day, setDay] = useState(1);
  const [portfolio, setPortfolio] = useState<Record<string, { lots: number; avg: number }>>({});
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("THYAO");
  const [lots, setLots] = useState(10);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const stock = findStock(symbol);
  
  // Random walk price simulation (cumulative daily changes)
  const dailyChange = useMemo(() => {
    // Seeded random based on day for consistency
    const seed = day * 137 + symbol.charCodeAt(0) * 31;
    const pseudoRandom = () => { const x = Math.sin(seed) * 10000; return x - Math.floor(x); };
    // Random daily change between -3% and +3% with slight mean reversion
    return (pseudoRandom() - 0.5) * 0.06;
  }, [day, symbol]);

  const cumulativeMultiplier = useMemo(() => {
    let mult = 1;
    for (let i = 1; i <= day; i++) {
      const s = i * 137 + symbol.charCodeAt(0) * 31;
      const r = () => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
      mult *= (1 + (r() - 0.5) * 0.06);
    }
    return mult;
  }, [day, symbol]);

  const currentPrice = stock ? stock.price * cumulativeMultiplier : 0;

  // Track price history for sparkline
  useEffect(() => {
    const history: number[] = [];
    let mult = 1;
    for (let i = 0; i <= day; i++) {
      history.push((stock?.price || 100) * mult);
      const s = (i + 1) * 137 + symbol.charCodeAt(0) * 31;
      const r = () => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
      mult *= (1 + (r() - 0.5) * 0.06);
    }
    setPriceHistory(history);
  }, [day, symbol, stock?.price]);

  const totalPortfolioValue = Object.entries(portfolio).reduce((sum, [sym, pos]) => {
    const s = findStock(sym); if (!s) return sum;
    // Her hisse kendi fiyat geçmişiyle değer kazanır (basitleştirilmiş)
    return sum + currentPrice * pos.lots;
  }, 0);
  const netWorth = balance + totalPortfolioValue;
  const returnPct = ((netWorth - initialBalance) / initialBalance) * 100;

  const buy = () => {
    if (!stock || balance < currentPrice * lots) return;
    const cost = currentPrice * lots;
    const existing = portfolio[symbol];
    const newLots = (existing?.lots || 0) + lots;
    const newAvg = existing ? (existing.avg * existing.lots + cost) / newLots : currentPrice;
    setPortfolio({ ...portfolio, [symbol]: { lots: newLots, avg: newAvg } });
    setBalance(balance - cost);
    setTrades([{ day, symbol, type: "AL", lots, price: currentPrice }, ...trades]);
  };
  const sell = () => {
    if (!stock || !portfolio[symbol] || portfolio[symbol].lots < lots) return;
    const revenue = currentPrice * lots;
    const remaining = portfolio[symbol].lots - lots;
    const next = { ...portfolio };
    if (remaining === 0) delete next[symbol]; else next[symbol] = { ...next[symbol], lots: remaining };
    setPortfolio(next);
    setBalance(balance + revenue);
    setTrades([{ day, symbol, type: "SAT", lots, price: currentPrice }, ...trades]);
  };
  const nextDay = () => setDay(day + 1);
  const reset = () => { setBalance(initialBalance); setDay(1); setPortfolio({}); setTrades([]); };

  return (
    <AppShell>
      <PageHeader
        title="Simülasyon"
        subtitle="Gerçek para riski olmadan alım-satım pratiği yapın."
        action={<button onClick={reset} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40"><RotateCcw className="w-4 h-4" /> Sıfırla</button>}
      />

      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Nakit</div><div className="text-2xl font-bold mt-1">{balance.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Portföy Değeri</div><div className="text-2xl font-bold mt-1">{totalPortfolioValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Net Değer</div><div className="text-2xl font-bold mt-1">{netWorth.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div></div>
        <div className="rounded-xl border border-primary/30 bg-card p-4"><div className="text-xs text-muted-foreground">Getiri (Gün {day})</div><div className={`text-2xl font-bold mt-1 ${returnPct >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>{returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}%</div></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground">{stock?.name}</div>
              <div className="text-2xl font-bold">{symbol} — {currentPrice.toFixed(2)} TL</div>
            </div>
            <button onClick={nextDay} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90"><Play className="w-4 h-4" /> Sonraki Gün</button>
          </div>
          <Sparkline data={priceHistory.length > 1 ? priceHistory : genLine(day * 7, 40, "flat")} color={currentPrice >= (stock?.price || 100) ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)"} height={200} width={600} />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2"><Beaker className="w-4 h-4 text-primary" /><div className="font-semibold text-sm">İşlem Yap</div></div>
          <div>
            <label className="text-xs text-muted-foreground">Hisse</label>
            <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm">
              {stocks.map((s) => <option key={s.symbol}>{s.symbol}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Adet</label>
            <input type="number" value={lots} onChange={(e) => setLots(+e.target.value)} className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="text-xs text-muted-foreground">Toplam: <span className="font-semibold text-foreground">{(currentPrice * lots).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</span></div>
          <div className="flex gap-2">
            <button onClick={buy} className="flex-1 bg-[color:var(--success)]/20 text-[color:var(--success)] rounded-lg py-2 text-sm font-semibold hover:bg-[color:var(--success)]/30">AL</button>
            <button onClick={sell} className="flex-1 bg-destructive/20 text-destructive rounded-lg py-2 text-sm font-semibold hover:bg-destructive/30">SAT</button>
          </div>
          {portfolio[symbol] && <div className="text-xs text-muted-foreground pt-2 border-t border-border">Elinizde: <span className="font-semibold text-foreground">{portfolio[symbol].lots} adet</span> (ort. {portfolio[symbol].avg.toFixed(2)} TL)</div>}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border font-semibold text-sm">İşlem Geçmişi</div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {trades.slice(0, 20).map((t, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-3 text-muted-foreground text-xs">Gün {t.day}</td>
                  <td className="font-semibold">{t.symbol}</td>
                  <td><span className={`text-xs font-bold px-2 py-0.5 rounded ${t.type === "AL" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" : "bg-destructive/20 text-destructive"}`}>{t.type}</span></td>
                  <td className="text-right">{t.lots} adet</td>
                  <td className="text-right pr-3">{t.price.toFixed(2)} TL</td>
                </tr>
              ))}
              {trades.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">Henüz işlem yapılmadı.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
