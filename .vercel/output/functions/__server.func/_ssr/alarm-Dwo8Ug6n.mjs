import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as fetchSingleStock, s as useServerFn } from "./ai.functions-CXjjUa8C.mjs";
import { A as Bell, M as BellOff, a as TrendingDown, h as Plus, i as TrendingUp, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
import { t as useAlarms } from "./storage-BdEgWm_8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alarm-Dwo8Ug6n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlarmPage() {
	const { alarms, add, remove, toggle } = useAlarms();
	const [form, setForm] = (0, import_react.useState)({
		symbol: "",
		type: "above",
		targetPrice: ""
	});
	const fetchSingle = useServerFn(fetchSingleStock);
	const { data: livePrices = {} } = useQuery({
		queryKey: ["alarm-prices", alarms.map((a) => a.symbol).join(",")],
		queryFn: async () => {
			try {
				const prices = {};
				const uniqueSymbols = [...new Set(alarms.map((a) => a.symbol))];
				for (const sym of uniqueSymbols) try {
					const result = await fetchSingle({ data: { symbol: sym } });
					if (result?.price) prices[sym] = result.price;
				} catch {}
				return prices;
			} catch {
				return {};
			}
		},
		staleTime: 6e4,
		refetchInterval: 12e4,
		throwOnError: false
	});
	const submit = (e) => {
		e.preventDefault();
		const price = Number(form.targetPrice);
		if (!form.symbol || !price) return;
		add({
			symbol: form.symbol.toUpperCase(),
			type: form.type,
			targetPrice: price,
			active: true
		});
		setForm({
			symbol: "",
			type: "above",
			targetPrice: ""
		});
	};
	const activeAlarms = alarms.filter((a) => a.active);
	const inactiveAlarms = alarms.filter((a) => !a.active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Fiyat Alarmları",
			subtitle: "Hisse fiyatlarını izleyin, hedef fiyatlara ulaştığında haberdar olun."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "rounded-xl border border-border bg-card p-4 flex flex-wrap gap-3 items-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Hisse"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.symbol,
						onChange: (e) => setForm({
							...form,
							symbol: e.target.value.toUpperCase()
						}),
						placeholder: "Örn: THYAO",
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm uppercase"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Alarm Tipi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.type,
						onChange: (e) => setForm({
							...form,
							type: e.target.value
						}),
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "above",
							children: "Fiyat Üzerine Çıkarsa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "below",
							children: "Fiyat Altına Düşerse"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[100px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Hedef Fiyat (TL)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						step: "0.01",
						value: form.targetPrice,
						onChange: (e) => setForm({
							...form,
							targetPrice: e.target.value
						}),
						placeholder: "0.00",
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Alarm Ekle"]
				})
			]
		}),
		activeAlarms.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-3 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-semibold text-sm flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-primary" }),
						"Aktif Alarmlar (",
						activeAlarms.length,
						")"
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: activeAlarms.map((a) => {
					const livePrice = livePrices[a.symbol];
					const triggered = livePrice ? a.type === "above" ? livePrice >= a.targetPrice : livePrice <= a.targetPrice : false;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center justify-between px-4 py-3 hover:bg-secondary/40 ${triggered ? "bg-primary/5" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/analiz",
									search: { symbol: a.symbol },
									className: "font-semibold hover:text-primary",
									children: a.symbol
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${a.type === "above" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-destructive/10 text-destructive"}`,
									children: [a.type === "above" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3 h-3" }), a.type === "above" ? "Üzeri" : "Altı"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted-foreground",
									children: [a.targetPrice.toFixed(2), " TL"]
								}),
								triggered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium",
									children: "Tetiklendi!"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								livePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-sm font-medium ${livePrice >= a.targetPrice ? "text-[color:var(--success)]" : "text-destructive"}`,
									children: [livePrice.toFixed(2), " TL"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggle(a.id),
									className: "text-muted-foreground hover:text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => remove(a.id),
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})
							]
						})]
					}, a.id);
				})
			})]
		}),
		inactiveAlarms.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card overflow-hidden opacity-60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-3 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-semibold text-sm text-muted-foreground flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "w-4 h-4" }),
						"Pasif Alarmlar (",
						inactiveAlarms.length,
						")"
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: inactiveAlarms.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-muted-foreground",
							children: a.symbol
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								a.type === "above" ? "Üzeri" : "Altı",
								" ",
								a.targetPrice.toFixed(2),
								" TL"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggle(a.id),
							className: "text-muted-foreground hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => remove(a.id),
							className: "text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})]
					})]
				}, a.id))
			})]
		}),
		alarms.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Henüz alarm eklenmemiş. Yukarıdan bir hisse için alarm ekleyin."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground",
			children: "Alarmlar localStorage'da saklanır. Canlı fiyatlar Yahoo Finance tarafından sağlanır."
		})
	] });
}
//#endregion
export { AlarmPage as component };
