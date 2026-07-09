import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home, LineChart, BarChart3, Sparkles, Filter, Briefcase, Star,
  Beaker, Newspaper, CalendarDays, Settings, Search, Bell, Sun, Moon, ArrowRight, Menu, X, BellRing,
  CandlestickChart, GitCompareArrows, FileText,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/stockbear-logo.png";
import aiChip from "@/assets/ai-chip.jpg";
import { stocks } from "@/lib/market-data";

const nav = [
  { icon: Home, label: "Ana Sayfa", to: "/" },
  { icon: LineChart, label: "Piyasa Özeti", to: "/piyasa" },
  { icon: BarChart3, label: "Hisse Analiz", to: "/analiz" },
  { icon: Sparkles, label: "AI Karar Motoru", to: "/ai" },
  { icon: Filter, label: "Screener", to: "/screener" },
  { icon: Briefcase, label: "Portföyüm", to: "/portfoy" },
  { icon: Star, label: "Takip Listem", to: "/takip" },
  { icon: BellRing, label: "Alarmlar", to: "/alarm" },
  { icon: Beaker, label: "Simülasyon", to: "/simulasyon" },
  { icon: Newspaper, label: "Haberler", to: "/haberler" },
  { icon: FileText, label: "Rapor Üretici", to: "/rapor" },
  { icon: CalendarDays, label: "Ekonomik Takvim", to: "/takvim" },
  { icon: CandlestickChart, label: "Teknik Grafik", to: "/grafik" },
  { icon: GitCompareArrows, label: "Karşılaştır", to: "/karsilastir" },
  { icon: Settings, label: "Ayarlar", to: "/ayarlar" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "light") { document.documentElement.classList.remove("dark"); setDark(false); }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const results = q.length > 0
    ? stocks.filter((s) => s.symbol.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-4 px-4 md:px-6 py-3 border-b border-border sticky top-0 z-30 bg-background/95 backdrop-blur">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="stockbear" width={40} height={40} className="w-10 h-10" />
          <span className="text-xl font-bold hidden sm:inline">stock<span className="text-primary">bear</span></span>
        </Link>
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Hisse ara..."
              className="w-full bg-secondary/60 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/40"
            />
          </div>
          {open && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-40">
              {results.map((s) => (
                <button
                  key={s.symbol}
                  onMouseDown={() => { navigate({ to: "/analiz", search: { symbol: s.symbol } }); setQ(""); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary text-left"
                >
                  <div>
                    <div className="font-semibold text-sm">{s.symbol}</div>
                    <div className="text-xs text-muted-foreground">{s.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{s.price.toFixed(2)} TL</div>
                    <div className={`text-xs ${s.change >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>{s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/alarm" className="relative w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground">
            <Bell className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Mobil menü overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Masaüstü sidebar */}
        <aside className="w-60 shrink-0 border-r border-border p-4 min-h-[calc(100vh-65px)] hidden lg:flex flex-col gap-1 sticky top-[65px] self-start max-h-[calc(100vh-65px)] overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="text-sm font-semibold">Canlı Piyasa Verisi</div>
            <p className="text-xs text-muted-foreground mt-1">Yahoo Finance ile BIST hisselerinin güncel fiyatlarını takip edin.</p>
            <img src={aiChip} alt="" width={512} height={256} loading="lazy" className="w-full h-20 object-cover rounded-lg my-3" />
            <Link to="/ai" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg py-2 hover:bg-primary/90">
              Keşfet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Mobil sidebar */}
        <aside className={`fixed top-[57px] left-0 w-64 h-[calc(100vh-57px)] bg-background border-r border-border p-4 flex flex-col gap-1 z-50 overflow-y-auto transition-transform duration-200 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}

// Shared helpers
export function seedRandom(seed: number) {
  return () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
}
export function genLine(seed: number, points = 40, trend: "up" | "down" | "flat" = "up") {
  const r = seedRandom(seed);
  const arr: number[] = []; let v = 50;
  for (let i = 0; i < points; i++) {
    const drift = trend === "up" ? 0.6 : trend === "down" ? -0.6 : 0;
    v += (r() - 0.5) * 6 + drift; arr.push(v);
  }
  return arr;
}
export function Sparkline({ data, color, height = 60, width = 200, fill = true }: { data: number[]; color: string; height?: number; width?: number; fill?: boolean }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`);
  const path = `M ${pts.join(" L ")}`;
  const area = `${path} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity="0.15" />}
      <path d={path} stroke={color} strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
