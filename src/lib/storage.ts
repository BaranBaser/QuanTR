import { useEffect, useState } from "react";

type Watchlist = string[];
type Portfolio = { symbol: string; lots: number; avgPrice: number }[];
type Alarm = { id: string; symbol: string; type: "above" | "below"; targetPrice: number; active: boolean; createdAt: string };

const WKEY = "stockbear.watchlist";
const PKEY = "stockbear.portfolio";
const AKEY = "stockbear.alarms";

export function useWatchlist() {
  const [list, setList] = useState<Watchlist>([]);
  useEffect(() => {
    const raw = localStorage.getItem(WKEY);
    if (raw) try { setList(JSON.parse(raw)); } catch (e) { console.warn("Watchlist parse error:", e); }
    else setList(["THYAO", "ASELS", "AKBNK"]);
  }, []);
  const save = (next: Watchlist) => { setList(next); localStorage.setItem(WKEY, JSON.stringify(next)); };
  const toggle = (s: string) => save(list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);
  return { list, toggle, has: (s: string) => list.includes(s), save };
}

export function usePortfolio() {
  const [items, setItems] = useState<Portfolio>([]);
  useEffect(() => {
    const raw = localStorage.getItem(PKEY);
    if (raw) try { setItems(JSON.parse(raw)); return; } catch (e) { console.warn("Portfolio parse error:", e); }
    setItems([]);
  }, []);
  const save = (next: Portfolio) => { setItems(next); localStorage.setItem(PKEY, JSON.stringify(next)); };
  const add = (p: Portfolio[number]) => {
    const existing = items.find((x) => x.symbol === p.symbol);
    if (existing) {
      const totalLots = existing.lots + p.lots;
      const avg = (existing.lots * existing.avgPrice + p.lots * p.avgPrice) / totalLots;
      save(items.map((x) => x.symbol === p.symbol ? { ...x, lots: totalLots, avgPrice: avg } : x));
    } else save([...items, p]);
  };
  const remove = (s: string) => save(items.filter((x) => x.symbol !== s));
  return { items, add, remove, save };
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(AKEY);
    if (raw) try { setAlarms(JSON.parse(raw)); } catch (e) { console.warn("Alarms parse error:", e); }
  }, []);
  const save = (next: Alarm[]) => { setAlarms(next); localStorage.setItem(AKEY, JSON.stringify(next)); };
  const add = (a: Omit<Alarm, "id" | "createdAt">) => {
    const newAlarm: Alarm = { ...a, id: Date.now().toString(36), createdAt: new Date().toISOString() };
    save([...alarms, newAlarm]);
  };
  const remove = (id: string) => save(alarms.filter((a) => a.id !== id));
  const toggle = (id: string) => save(alarms.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  const check = (symbol: string, currentPrice: number) => {
    return alarms.filter((a) => a.symbol === symbol && a.active).map((a) => ({
      ...a,
      triggered: a.type === "above" ? currentPrice >= a.targetPrice : currentPrice <= a.targetPrice,
    }));
  };
  return { alarms, add, remove, toggle, check };
}

type AlarmHistoryEntry = {
  id: string;
  symbol: string;
  type: "above" | "below";
  targetPrice: number;
  triggeredPrice: number;
  triggeredAt: string;
};

const AHKEY = "stockbear.alarmHistory";

export function useAlarmHistory() {
  const [entries, setEntries] = useState<AlarmHistoryEntry[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(AHKEY);
    if (raw) try { setEntries(JSON.parse(raw)); } catch (e) { console.warn("Alarm history parse error:", e); }
  }, []);
  const save = (next: AlarmHistoryEntry[]) => { setEntries(next); localStorage.setItem(AHKEY, JSON.stringify(next)); };
  const add = (entry: Omit<AlarmHistoryEntry, "id">) => {
    const newEntry: AlarmHistoryEntry = { ...entry, id: Date.now().toString(36) };
    save([newEntry, ...entries].slice(0, 100));
  };
  const clear = () => save([]);
  return { entries, add, clear };
}
