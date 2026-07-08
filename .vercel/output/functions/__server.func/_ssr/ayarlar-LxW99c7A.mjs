import { r as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Bell, _ as Palette, c as Sun, r as User, y as Moon } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ayarlar-LxW99c7A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [tab, setTab] = (0, import_react.useState)("profile");
	const [dark, setDark] = (0, import_react.useState)(true);
	const [notify, setNotify] = (0, import_react.useState)({
		price: true,
		ai: true,
		news: false,
		email: true
	});
	const [profile, setProfile] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: ""
	});
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const savedProfile = localStorage.getItem("stockbear.profile");
		const savedNotify = localStorage.getItem("stockbear.notify");
		const savedTheme = localStorage.getItem("theme");
		if (savedProfile) try {
			setProfile(JSON.parse(savedProfile));
		} catch {}
		if (savedNotify) try {
			setNotify(JSON.parse(savedNotify));
		} catch {}
		if (savedTheme === "light") setDark(false);
	}, []);
	const saveProfile = () => {
		localStorage.setItem("stockbear.profile", JSON.stringify(profile));
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	};
	const saveNotify = () => {
		localStorage.setItem("stockbear.notify", JSON.stringify(notify));
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	};
	const toggleTheme = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Ayarlar",
		subtitle: "Hesabınızı ve tercihlerinizi yönetin."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-4 gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "rounded-xl border border-border bg-card p-2 h-fit",
			children: [
				{
					k: "profile",
					l: "Profil",
					i: User
				},
				{
					k: "notifications",
					l: "Bildirimler",
					i: Bell
				},
				{
					k: "appearance",
					l: "Görünüm",
					i: Palette
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setTab(t.k),
				className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${tab === t.k ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.i, { className: "w-4 h-4" }),
					" ",
					t.l
				]
			}, t.k))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-3 rounded-xl border border-border bg-card p-6",
			children: [
				tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg mb-2",
							children: "Profil Bilgileri"
						}),
						[
							{
								k: "name",
								l: "Ad Soyad",
								placeholder: "Adınız Soyadınız"
							},
							{
								k: "email",
								l: "E-posta",
								placeholder: "ornek@email.com"
							},
							{
								k: "phone",
								l: "Telefon",
								placeholder: "+90 555 000 00 00"
							}
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: f.l
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: profile[f.k],
							onChange: (e) => setProfile({
								...profile,
								[f.k]: e.target.value
							}),
							placeholder: f.placeholder,
							className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
						})] }, f.k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: saveProfile,
								className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90",
								children: "Kaydet"
							}), saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[color:var(--success)]",
								children: "Kaydedildi!"
							})]
						})
					]
				}),
				tab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg mb-2",
							children: "Bildirim Tercihleri"
						}),
						[
							{
								k: "price",
								l: "Fiyat Uyarıları",
								d: "Belirlediğiniz fiyat seviyelerinde bildirim alın."
							},
							{
								k: "ai",
								l: "Analiz Bildirimleri",
								d: "Yeni piyasa analizleri geldiğinde haberdar olun."
							},
							{
								k: "news",
								l: "Haber Bildirimleri",
								d: "Portföyünüzdeki hisselere dair haberler."
							},
							{
								k: "email",
								l: "E-posta Özeti",
								d: "Günlük piyasa özetini e-posta ile alın."
							}
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/40 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-sm",
								children: n.l
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: n.d
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: notify[n.k],
								onChange: (e) => setNotify({
									...notify,
									[n.k]: e.target.checked
								}),
								className: "accent-primary w-4 h-4 mt-1"
							})]
						}, n.k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: saveNotify,
								className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90",
								children: "Kaydet"
							}), saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[color:var(--success)]",
								children: "Kaydedildi!"
							})]
						})
					]
				}),
				tab === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-lg mb-2",
						children: "Görünüm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between p-3 rounded-lg bg-secondary/40 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium text-sm",
								children: [dark ? "Karanlık" : "Aydınlık", " Mod"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Tema tercihinizi değiştirin."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggleTheme,
							className: `w-11 h-6 rounded-full transition-colors ${dark ? "bg-primary" : "bg-secondary border border-border"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-5 h-5 rounded-full bg-white transition-transform ${dark ? "translate-x-5.5" : "translate-x-0.5"}` })
						})]
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
