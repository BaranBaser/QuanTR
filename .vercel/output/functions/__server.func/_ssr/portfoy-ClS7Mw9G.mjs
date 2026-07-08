import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as fetchSingleStock, s as useServerFn } from "./ai.functions-CXjjUa8C.mjs";
import { h as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
import { n as usePortfolio } from "./storage-BdEgWm_8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfoy-ClS7Mw9G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortfoyPage() {
	const { items, add, remove } = usePortfolio();
	const [form, setForm] = (0, import_react.useState)({
		symbol: "",
		lots: "",
		avgPrice: ""
	});
	const fetchSingle = useServerFn(fetchSingleStock);
	const { data: livePrices = {} } = useQuery({
		queryKey: ["portfolio-prices", items.map((i) => i.symbol).join(",")],
		queryFn: async () => {
			try {
				const prices = {};
				for (const item of items) try {
					const result = await fetchSingle({ data: { symbol: item.symbol } });
					if (result?.price) prices[item.symbol] = result.price;
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
	const rows = (0, import_react.useMemo)(() => items.map((it) => {
		const livePrice = livePrices[it.symbol];
		const price = livePrice || it.avgPrice;
		const value = price * it.lots;
		const cost = it.avgPrice * it.lots;
		const pl = value - cost;
		const plPct = pl / cost * 100;
		return {
			...it,
			price,
			value,
			cost,
			pl,
			plPct,
			hasLivePrice: !!livePrice
		};
	}), [items, livePrices]);
	const totals = rows.reduce((acc, r) => ({
		value: acc.value + r.value,
		cost: acc.cost + r.cost,
		pl: acc.pl + r.pl
	}), {
		value: 0,
		cost: 0,
		pl: 0
	});
	const totalPct = totals.cost > 0 ? totals.pl / totals.cost * 100 : 0;
	const submit = (e) => {
		e.preventDefault();
		const lots = Number(form.lots), avg = Number(form.avgPrice);
		if (!form.symbol || !lots || !avg) return;
		add({
			symbol: form.symbol.toUpperCase(),
			lots,
			avgPrice: avg
		});
		setForm({
			symbol: "",
			lots: "",
			avgPrice: ""
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Portföyüm",
			subtitle: "Pozisyonlarınızı takip edin, kâr/zarar analizi yapın."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Toplam Değer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold mt-1",
						children: [totals.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Maliyet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold mt-1",
						children: [totals.cost.toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Kâr / Zarar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `text-2xl font-bold mt-1 ${totals.pl >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
						children: [
							totals.pl >= 0 ? "+" : "",
							totals.pl.toLocaleString("tr-TR", { maximumFractionDigits: 0 }),
							" TL"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Getiri"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `text-2xl font-bold mt-1 ${totalPct >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
						children: [
							totalPct >= 0 ? "+" : "",
							totalPct.toFixed(2),
							"%"
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "rounded-xl border border-border bg-card p-4 flex flex-wrap gap-3 items-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Hisse (Örn: THYAO)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.symbol,
						onChange: (e) => setForm({
							...form,
							symbol: e.target.value.toUpperCase()
						}),
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm uppercase"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[100px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Adet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.lots,
						onChange: (e) => setForm({
							...form,
							lots: e.target.value
						}),
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[100px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Ort. Maliyet (TL)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						step: "0.01",
						value: form.avgPrice,
						onChange: (e) => setForm({
							...form,
							avgPrice: e.target.value
						}),
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Pozisyon Ekle"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm min-w-[700px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-normal",
									children: "Hisse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Adet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Ort. Maliyet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Güncel Fiyat"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Değer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "K/Z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "text-right font-normal pr-3" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border hover:bg-secondary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/analiz",
									search: { symbol: r.symbol },
									className: "font-semibold hover:text-primary",
									children: r.symbol
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right",
								children: r.lots
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right",
								children: [r.avgPrice.toFixed(2), " TL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: r.hasLivePrice ? "" : "text-muted-foreground",
									children: [r.price.toFixed(2), " TL"]
								}), r.hasLivePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-1 w-1.5 h-1.5 rounded-full bg-[color:var(--success)] inline-block" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right font-medium",
								children: [r.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: `text-right ${r.pl >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
								children: [
									r.pl >= 0 ? "+" : "",
									r.pl.toLocaleString("tr-TR", { maximumFractionDigits: 0 }),
									" TL ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs",
										children: [
											"(",
											r.plPct >= 0 ? "+" : "",
											r.plPct.toFixed(2),
											"%)"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right pr-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => remove(r.symbol),
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})
							})
						]
					}, r.symbol)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "p-8 text-center text-muted-foreground text-sm",
						children: "Portföyünüz boş. Yukarıdan pozisyon ekleyin."
					}) })] })]
				})
			})
		})
	] });
}
//#endregion
export { PortfoyPage as component };
