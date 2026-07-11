import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  User, Bell, Shield, Palette, Database, Info, Check, Sun, Moon,
  LogOut, Mail, AlertCircle, Loader2, Wallet, Globe, Monitor,
  Trash2, Download, RefreshCw, ChevronRight, Lock, Eye, EyeOff,
  Smartphone, Volume2, VolumeX, Clock, HardDrive, Github,
  Sparkles, Newspaper,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  isFirebaseConfigured,
  firebaseCreateUser,
  firebaseSignIn,
  firebaseSendVerification,
  firebaseSendReset,
  firebaseSignOut,
  firebaseOnAuthChange,
  firebaseUpdateProfile,
  type FirebaseUser,
} from "@/lib/firebase";

export const Route = createFileRoute("/ayarlar")({
  head: () => ({
    meta: [
      { title: "Ayarlar — stockbear" },
      { name: "description", content: "Hesap ayarları ve tercihleri." },
      { property: "og:title", content: "Ayarlar — stockbear" },
    ],
  }),
  component: SettingsPage,
});

// ─── Toggle Switch ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? "bg-primary" : "bg-secondary border border-border"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-5.5" : "translate-x-0.5"
      }`} />
    </button>
  );
}

// ─── Settings Card ──────────────────────────────────────────────────────────

function SettingsCard({ icon: Icon, title, description, children }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Account Section ────────────────────────────────────────────────────────

function AccountSection() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    firebaseOnAuthChange((u) => {
      setUser(u as FirebaseUser | null);
      setLoading(false);
    }).then((unsub) => () => unsub());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) { setError("Firebase yapılandırılmamış. .env dosyasını kontrol edin."); return; }
    setAuthLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const cred = await firebaseCreateUser(email, password);
        if (name.trim()) await firebaseUpdateProfileLocal(cred.user, name.trim());
        await firebaseSendVerification(cred.user as never);
        toast.success("Kayıt başarılı! E-posta doğrulama linki gönderildi.");
      } else {
        const cred = await firebaseSignIn(email, password);
        if (!cred.user.emailVerified) {
          await firebaseSendVerification(cred.user as never);
          toast.info("E-posta doğrulama linki yeniden gönderildi.");
        }
        toast.success("Giriş başarılı!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) setError("Bu e-posta zaten kayıtlı.");
      else if (msg.includes("weak-password")) setError("Şifre en az 6 karakter olmalıdır.");
      else if (msg.includes("user-not-found")) setError("Kullanıcı bulunamadı.");
      else if (msg.includes("wrong-password")) setError("Şifre hatalı.");
      else if (msg.includes("too-many-requests")) setError("Çok fazla deneme. Bekleyin.");
      else setError(msg || "Bir hata oluştu.");
    }
    setAuthLoading(false);
  };

  const firebaseUpdateProfileLocal = async (u: unknown, displayName: string) => {
    try { await firebaseUpdateProfile(u, { displayName }); } catch {}
  };

  const handleReset = async () => {
    if (!email.trim()) { setError("E-posta adresinizi girin."); return; }
    try { await firebaseSendReset(email); toast.success("Şifre sıfırlama linki gönderildi!"); }
    catch { setError("Şifre sıfırlama gönderilemedi."); }
  };

  const logout = async () => {
    await firebaseSignOut();
    setEmail(""); setPassword(""); setName("");
    toast.success("Çıkış yapıldı.");
  };

  if (loading) return (
    <SettingsCard icon={User} title="Hesap" description="Giriş yapın veya hesap oluşturun">
      <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
      </div>
    </SettingsCard>
  );

  if (!isFirebaseConfigured) return (
    <SettingsCard icon={User} title="Hesap" description="E-posta ile giriş ve kayıt">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div>
            <div className="font-medium">Firebase yapılandırılmamış</div>
            <div className="text-muted-foreground mt-0.5">E-posta ile giriş için .env dosyasına Firebase config ekleyin. Şu an tüm veriler tarayıcıda saklanır.</div>
          </div>
        </div>
        <div className="bg-secondary/40 rounded-lg p-4">
          <div className="text-sm font-medium mb-1">Tarayıcı Depolama Modu</div>
          <div className="text-xs text-muted-foreground">Verileriniz bu tarayıcıda saklanır. Farklı tarayıcılarda veya cihazlarda verileriniz eşzamanlanmaz.</div>
        </div>
      </div>
    </SettingsCard>
  );

  return (
    <SettingsCard icon={User} title="Hesap" description="E-posta ile giriş ve kayıt">
      {!user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="text-xs text-muted-foreground">Ad Soyad</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız"
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground">E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" required
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Şifre</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {!isSignUp && password.length > 0 && (
              <div className="mt-1.5 flex gap-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${
                    password.length >= i * 3 ? password.length >= 12 ? "bg-[color:var(--success)]" : password.length >= 8 ? "bg-yellow-500" : "bg-orange-500" : "bg-secondary"
                  }`} />
                ))}
              </div>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 rounded-lg p-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={authLoading}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {authLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
            </button>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              {isSignUp ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
          </div>
          {!isSignUp && (
            <button type="button" onClick={handleReset} className="text-xs text-muted-foreground hover:text-primary underline">
              Şifremi Unuttum
            </button>
          )}
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
              {(user.displayName?.charAt(0) || user.email?.charAt(0) || "?").toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{user.displayName || "Kullanıcı"}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--success)] bg-[color:var(--success)]/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Doğrulanmış
                  </span>
                ) : (
                  <button onClick={() => firebaseSendVerification(user as never).then(() => toast.success("Doğrulama linki gönderildi!"))}
                    className="inline-flex items-center gap-1 text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full hover:bg-yellow-500/20">
                    <Mail className="w-3 h-3" /> Doğrulanmamış — Tıkla
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={logout} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              <LogOut className="w-4 h-4" /> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </SettingsCard>
  );
}

// ─── Portfolio Settings ─────────────────────────────────────────────────────

function PortfolioSettings() {
  const [settings, setSettings] = useState(() => {
    const raw = localStorage.getItem("stockbear.portfolioSettings");
    if (raw) try { return JSON.parse(raw); } catch {}
    return { defaultLots: 1, currency: "TRY", view: "table", showPnl: true, showPercent: true };
  });

  const save = (next: typeof settings) => {
    setSettings(next);
    localStorage.setItem("stockbear.portfolioSettings", JSON.stringify(next));
    toast.success("Kaydedildi!");
  };

  return (
    <SettingsCard icon={Wallet} title="Portföy Ayarları" description="Portföy görünümü ve varsayılan değerler">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Varsayılan Lot Miktarı</label>
            <input type="number" min={1} value={settings.defaultLots}
              onChange={(e) => save({ ...settings, defaultLots: parseInt(e.target.value) || 1 })}
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Para Birimi</label>
            <select value={settings.currency}
              onChange={(e) => save({ ...settings, currency: e.target.value })}
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="TRY">₺ Türk Lirası</option>
              <option value="USD">$ ABD Doları</option>
              <option value="EUR">€ Euro</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Görünüm Modu</label>
          <div className="flex gap-2">
            {[
              { k: "table", l: "Tablo", icon: Monitor },
              { k: "grid", l: "Grid", icon: Smartphone },
            ].map((v) => (
              <button key={v.k} onClick={() => save({ ...settings, view: v.k })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors ${
                  settings.view === v.k ? "bg-primary/10 border-primary text-primary" : "bg-secondary border-border hover:bg-secondary/80"
                }`}>
                <v.icon className="w-4 h-4" /> {v.l}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {[
            { k: "showPnl", l: "Kâr/Zarar Göster", d: "Portföyde her hisse için kâr/zarar bilgisini gösterir." },
            { k: "showPercent", l: "Yüzde Göster", d: "Değişimleri yüzde olarak gösterir." },
          ].map((opt) => (
            <label key={opt.k} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/40 cursor-pointer">
              <div>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-muted-foreground">{opt.d}</div>
              </div>
              <Toggle checked={settings[opt.k as keyof typeof settings] as boolean}
                onChange={(v) => save({ ...settings, [opt.k]: v })} />
            </label>
          ))}
        </div>
      </div>
    </SettingsCard>
  );
}

// ─── Notification Settings ──────────────────────────────────────────────────

function NotificationSettings() {
  const [settings, setSettings] = useState(() => {
    const raw = localStorage.getItem("stockbear.notify");
    if (raw) try { return JSON.parse(raw); } catch {}
    return { price: true, ai: true, news: false, email: true, sound: true, push: false };
  });

  const save = (next: typeof settings) => {
    setSettings(next);
    localStorage.setItem("stockbear.notify", JSON.stringify(next));
  };

  const items = [
    { k: "price", l: "Fiyat Uyarıları", d: "Alarm fiyatlarına ulaşıldığında bildirim alın.", icon: Bell },
    { k: "ai", l: "AI Sinyalleri", d: "Yeni alım-satım sinyali üretildiğinde haberdar olun.", icon: Sparkles },
    { k: "news", l: "Haber Bildirimleri", d: "Portföyünüzdeki hisselere dair haberler.", icon: Newspaper },
    { k: "email", l: "E-posta Özeti", d: "Günlük piyasa özetini e-posta ile alın.", icon: Mail },
    { k: "sound", l: "Sesli Bildirim", d: "Bildirim geldiğinde ses çalsın.", icon: Volume2 },
    { k: "push", l: "Push Bildirim", d: "Tarayıcı bildirimleri ile anlık uyarılar.", icon: Smartphone },
  ];

  return (
    <SettingsCard icon={Bell} title="Bildirimler" description="Hangi durumlarda bildirim alacağınızı belirleyin">
      <div className="space-y-1">
        {items.map((n) => (
          <label key={n.k} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-secondary/40 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <n.icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{n.l}</div>
                <div className="text-xs text-muted-foreground">{n.d}</div>
              </div>
            </div>
            <Toggle checked={settings[n.k as keyof typeof settings] as boolean}
              onChange={(v) => save({ ...settings, [n.k]: v })} />
          </label>
        ))}
      </div>
    </SettingsCard>
  );
}

// ─── Appearance Settings ────────────────────────────────────────────────────

function AppearanceSettings() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") !== "light";
  });
  const [density, setDensity] = useState(() => localStorage.getItem("stockbear.density") || "comfortable");
  const [language, setLanguage] = useState(() => localStorage.getItem("stockbear.lang") || "tr");
  const [chartTheme, setChartTheme] = useState(() => localStorage.getItem("stockbear.chartTheme") || "auto");

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const updateDensity = (v: string) => {
    setDensity(v);
    localStorage.setItem("stockbear.density", v);
    toast.success("Görünüm güncellendi.");
  };

  const updateLang = (v: string) => {
    setLanguage(v);
    localStorage.setItem("stockbear.lang", v);
    toast.success("Dil güncellendi.");
  };

  return (
    <SettingsCard icon={Palette} title="Görünüm" description="Tema, dil ve yoğunluk ayarları">
      <div className="space-y-4">
        <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 cursor-pointer">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <div>
              <div className="font-medium text-sm">{dark ? "Karanlık" : "Aydınlık"} Mod</div>
              <div className="text-xs text-muted-foreground">Gözlerinizi yormayan karanlık tema.</div>
            </div>
          </div>
          <Toggle checked={dark} onChange={toggleTheme} />
        </label>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Yoğunluk</label>
          <div className="flex gap-2">
            {[
              { k: "compact", l: "Kompakt", d: "Daha az boşluk" },
              { k: "comfortable", l: "Rahat", d: "Varsayılan" },
              { k: "spacious", l: "Geniş", d: "Daha fazla boşluk" },
            ].map((d) => (
              <button key={d.k} onClick={() => updateDensity(d.k)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  density === d.k ? "bg-primary/10 border-primary text-primary" : "bg-secondary border-border hover:bg-secondary/80"
                }`}>
                <div className="font-medium">{d.l}</div>
                <div className="text-[10px] text-muted-foreground">{d.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Dil</label>
            <select value={language} onChange={(e) => updateLang(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Grafik Teması</label>
            <select value={chartTheme} onChange={(e) => { setChartTheme(e.target.value); localStorage.setItem("stockbear.chartTheme", e.target.value); }}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="auto">Otomatik</option>
              <option value="dark">Karanlık</option>
              <option value="light">Aydınlık</option>
            </select>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

// ─── Data & Cache Settings ──────────────────────────────────────────────────

function DataCacheSettings() {
  const [cacheSize, setCacheSize] = useState("--");

  useEffect(() => {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("stockbear.")) {
          total += (localStorage.getItem(key) || "").length * 2;
        }
      }
      setCacheSize(total > 1024 * 1024 ? `${(total / 1024 / 1024).toFixed(1)} MB` : `${(total / 1024).toFixed(1)} KB`);
    } catch { setCacheSize("Bilinmiyor"); }
  }, []);

  const clearCache = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("stockbear.") && !key.includes("profile") && !key.includes("notify") && !key.includes("portfolioSettings") && !key.includes("lang") && !key.includes("density") && !key.includes("chartTheme")) {
        keys.push(key);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));
    setCacheSize("0 KB");
    toast.success(`${keys.length} önbellek kaydı silindi.`);
  };

  const clearAll = () => {
    const keep: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("stockbear.")) keep[key] = localStorage.getItem(key) || "";
    }
    localStorage.clear();
    Object.entries(keep).filter(([k]) =>
      k.includes("profile") || k.includes("notify") || k.includes("portfolioSettings") || k.includes("lang") || k.includes("density") || k.includes("chartTheme")
    ).forEach(([k, v]) => localStorage.setItem(k, v));
    setCacheSize("0 KB");
    toast.success("Tüm önbellek temizlendi.");
  };

  const exportData = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("stockbear.")) {
        try { data[key] = JSON.parse(localStorage.getItem(key) || ""); }
        catch { data[key] = localStorage.getItem(key); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `stockbear-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    toast.success("Veriler dışa aktarıldı!");
  };

  return (
    <SettingsCard icon={Database} title="Veri & Önbellek" description="Veri depolama ve önbellek yönetimi">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Önbellek Boyutu</div>
              <div className="text-xs text-muted-foreground">{cacheSize} yer kaplıyor</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date().toLocaleDateString("tr-TR")}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={clearCache}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium hover:bg-secondary/80 transition-colors">
            <RefreshCw className="w-4 h-4" /> Önbelleği Temizle
          </button>
          <button onClick={exportData}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" /> Dışa Aktar
          </button>
          <button onClick={clearAll}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
            <Trash2 className="w-4 h-4" /> Tümünü Sil
          </button>
        </div>
      </div>
    </SettingsCard>
  );
}

// ─── About Section ──────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <SettingsCard icon={Info} title="Hakkında" description="Uygulama bilgileri">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-black text-primary">SB</span>
          </div>
          <div>
            <div className="font-bold text-lg">stockbear</div>
            <div className="text-xs text-muted-foreground">Borsa analiz ve takip platformu</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Versiyon 2.0.0 • Build {new Date().getFullYear()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { l: "Motor", v: "TanStack Start + React" },
            { l: "ML", v: "Ridge + XGBoost + LightGBM" },
            { l: "Veri", v: "Yahoo Finance API" },
            { l: "Deploy", v: "Render.com" },
          ].map((item) => (
            <div key={item.l} className="flex justify-between p-2 rounded bg-secondary/40">
              <span className="text-muted-foreground">{item.l}</span>
              <span className="font-medium">{item.v}</span>
            </div>
          ))}
        </div>

        <a href="https://github.com/BaranBaser/stockbear" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-sm hover:bg-secondary/80 transition-colors">
          <Github className="w-4 h-4" /> GitHub'da Görüntüle
        </a>
      </div>
    </SettingsCard>
  );
}

// ─── Main Settings Page ─────────────────────────────────────────────────────

const tabs = [
  { k: "account", l: "Hesap", i: User },
  { k: "portfolio", l: "Portföy", i: Wallet },
  { k: "notifications", l: "Bildirimler", i: Bell },
  { k: "appearance", l: "Görünüm", i: Palette },
  { k: "data", l: "Veri", i: Database },
  { k: "about", l: "Hakkında", i: Info },
] as const;

function SettingsPage() {
  const [tab, setTab] = useState<string>("account");

  return (
    <AppShell>
      <PageHeader title="Ayarlar" subtitle="Hesabınızı ve tercihlerinizi yönetin." />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.k ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-secondary"
            }`}>
            <t.i className="w-4 h-4" /> {t.l}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {tab === "account" && <AccountSection />}
        {tab === "portfolio" && <PortfolioSettings />}
        {tab === "notifications" && <NotificationSettings />}
        {tab === "appearance" && <AppearanceSettings />}
        {tab === "data" && <DataCacheSettings />}
        {tab === "about" && <AboutSection />}
      </div>
    </AppShell>
  );
}
