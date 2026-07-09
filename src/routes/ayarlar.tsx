import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { User, Bell, Shield, Palette, Check, Sun, Moon, LogOut, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/ayarlar")({ component: SettingsPage });

interface StockBearUser {
  name: string;
  email: string;
}

function AccountSection() {
  const [user, setUser] = useState<StockBearUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("stockbear.user");
    if (raw) try { setUser(JSON.parse(raw)); } catch {}
  }, []);

  const login = () => {
    if (!name.trim() || !email.trim()) return;
    const u = { name: name.trim(), email: email.trim() };
    localStorage.setItem("stockbear.user", JSON.stringify(u));
    setUser(u);
  };

  const demoLogin = () => {
    const u = { name: "Demo Kullanıcı", email: "demo@stockbear.app" };
    localStorage.setItem("stockbear.user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("stockbear.user");
    setUser(null);
    setName("");
    setEmail("");
  };

  const deleteAccount = () => {
    localStorage.removeItem("stockbear.user");
    localStorage.removeItem("stockbear.profile");
    localStorage.removeItem("stockbear.notify");
    setUser(null);
    setName("");
    setEmail("");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <User className="w-5 h-5" /> Kullanıcı Hesabı
      </h3>

      {!user ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Ad</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız"
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">E-posta</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={login} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Giriş Yap
            </button>
            <button onClick={demoLogin} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              Demo Olarak Devam Et
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={logout} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              <LogOut className="w-4 h-4" /> Çıkış Yap
            </button>
            <button onClick={deleteAccount} className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-4 py-2 text-sm font-medium hover:bg-destructive/20">
              <Trash2 className="w-4 h-4" /> Hesap Sil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "notifications" | "appearance">("profile");
  const [dark, setDark] = useState(true);
  const [notify, setNotify] = useState({ price: true, ai: true, news: false, email: true });
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("stockbear.profile");
    const savedNotify = localStorage.getItem("stockbear.notify");
    const savedTheme = localStorage.getItem("theme");
    if (savedProfile) try { setProfile(JSON.parse(savedProfile)); } catch {}
    if (savedNotify) try { setNotify(JSON.parse(savedNotify)); } catch {}
    if (savedTheme === "light") { setDark(false); }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("stockbear.profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveNotify = () => {
    localStorage.setItem("stockbear.notify", JSON.stringify(notify));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const tabs = [
    { k: "profile", l: "Profil", i: User },
    { k: "notifications", l: "Bildirimler", i: Bell },
    { k: "appearance", l: "Görünüm", i: Palette },
  ] as const;

  return (
    <AppShell>
      <PageHeader title="Ayarlar" subtitle="Hesabınızı ve tercihlerinizi yönetin." />

      <AccountSection />

      <div className="grid lg:grid-cols-4 gap-4">
        <nav className="rounded-xl border border-border bg-card p-2 h-fit">
          {tabs.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${tab === t.k ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"}`}>
              <t.i className="w-4 h-4" /> {t.l}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6">
          {tab === "profile" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Profil Bilgileri</h3>
              {[
                { k: "name", l: "Ad Soyad", placeholder: "Adınız Soyadınız" },
                { k: "email", l: "E-posta", placeholder: "ornek@email.com" },
                { k: "phone", l: "Telefon", placeholder: "+90 555 000 00 00" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-xs text-muted-foreground">{f.l}</label>
                  <input
                    value={profile[f.k as keyof typeof profile]}
                    onChange={(e) => setProfile({ ...profile, [f.k]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
              <div className="flex items-center gap-3">
                <button onClick={saveProfile} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90">Kaydet</button>
                {saved && <span className="text-xs text-[color:var(--success)]">Kaydedildi!</span>}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Bildirim Tercihleri</h3>
              {[
                { k: "price", l: "Fiyat Uyarıları", d: "Belirlediğiniz fiyat seviyelerinde bildirim alın." },
                { k: "ai", l: "Analiz Bildirimleri", d: "Yeni piyasa analizleri geldiğinde haberdar olun." },
                { k: "news", l: "Haber Bildirimleri", d: "Portföyünüzdeki hisselere dair haberler." },
                { k: "email", l: "E-posta Özeti", d: "Günlük piyasa özetini e-posta ile alın." },
              ].map((n) => (
                <label key={n.k} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/40 cursor-pointer">
                  <div>
                    <div className="font-medium text-sm">{n.l}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{n.d}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notify[n.k as keyof typeof notify]}
                    onChange={(e) => setNotify({ ...notify, [n.k]: e.target.checked })}
                    className="accent-primary w-4 h-4 mt-1"
                  />
                </label>
              ))}
              <div className="flex items-center gap-3">
                <button onClick={saveNotify} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90">Kaydet</button>
                {saved && <span className="text-xs text-[color:var(--success)]">Kaydedildi!</span>}
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Görünüm</h3>
              <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 cursor-pointer">
                <div className="flex items-center gap-3">
                  {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <div className="font-medium text-sm">{dark ? "Karanlık" : "Aydınlık"} Mod</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Tema tercihinizi değiştirin.</div>
                  </div>
                </div>
                <button onClick={toggleTheme} className={`w-11 h-6 rounded-full transition-colors ${dark ? "bg-primary" : "bg-secondary border border-border"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${dark ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
