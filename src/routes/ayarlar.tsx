import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { User, Bell, Shield, Palette, Check, Sun, Moon, LogOut, Trash2, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
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

function AccountSection() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
        await sendEmailVerification(cred.user);
        setSuccess("Kayıt başarılı! E-posta adresinize doğrulama linki gönderildi. Lütfen e-postanızı kontrol edin.");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
          await sendEmailVerification(cred.user);
          setSuccess("E-posta adresiniz doğrulanmamış. Doğrulama linki yeniden gönderildi.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu";
      if (msg.includes("auth/email-already-in-use")) setError("Bu e-posta adresi zaten kayıtlı.");
      else if (msg.includes("auth/invalid-email")) setError("Geçersiz e-posta adresi.");
      else if (msg.includes("auth/weak-password")) setError("Şifre en az 6 karakter olmalıdır.");
      else if (msg.includes("auth/user-not-found")) setError("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
      else if (msg.includes("auth/wrong-password")) setError("Şifre hatalı.");
      else if (msg.includes("auth/too-many-requests")) setError("Çok fazla deneme. Lütfen biraz bekleyin.");
      else setError(msg);
    }
    setAuthLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) { setError("Şifre sıfırlama için e-posta adresinizi girin."); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setSuccess("Şifre sıfırlama linki e-posta adresinize gönderildi.");
    } catch {
      setError("Şifre sıfırlama gönderilemedi. E-posta adresinizi kontrol edin.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setEmail("");
    setPassword("");
    setName("");
    setSuccess("");
    setError("");
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <User className="w-5 h-5" /> Kullanıcı Hesabı
      </h3>

      {!user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="text-xs text-muted-foreground">Ad Soyad</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 rounded-lg p-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-[color:var(--success)] text-xs bg-[color:var(--success)]/10 rounded-lg p-2">
              <Check className="w-3.5 h-3.5 shrink-0" /> {success}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={authLoading} className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {authLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
            </button>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              {isSignUp ? "Zaten hesabım var" : "Hesap Oluştur"}
            </button>
          </div>

          {!isSignUp && (
            <button type="button" onClick={handleResetPassword} className="text-xs text-muted-foreground hover:text-primary underline">
              Şifremi Unuttum
            </button>
          )}

          {isSignUp && (
            <p className="text-[10px] text-muted-foreground">
              Kayıt olarak Kullanım Koşullarını ve Gizlilik Politikamızı kabul etmiş olursunuz.
            </p>
          )}
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
              {(user.displayName?.charAt(0) || user.email?.charAt(0) || "?").toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user.displayName || "Kullanıcı"}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

          {!user.emailVerified && (
            <div className="flex items-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 rounded-lg p-2">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              E-posta adresiniz doğrulanmamış.
              <button onClick={() => sendEmailVerification(user).then(() => setSuccess("Doğrulama linki gönderildi!"))} className="underline hover:text-yellow-600">
                Yeniden Gönder
              </button>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-[color:var(--success)] text-xs bg-[color:var(--success)]/10 rounded-lg p-2">
              <Check className="w-3.5 h-3.5 shrink-0" /> {success}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={logout} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              <LogOut className="w-4 h-4" /> Çıkış Yap
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
