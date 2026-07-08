import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as fetchSingleStock, s as useServerFn } from "./ai.functions-CXjjUa8C.mjs";
import { h as Plus, l as Star, n as X } from "../_libs/lucide-react.mjs";
import { a as findStock, c as stocks, i as Sparkline, n as PageHeader, o as genLine, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
import { r as useWatchlist } from "./storage-BdEgWm_8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/takip-CNV2cYLD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TakipPage() {
	const { list, toggle } = useWatchlist();
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const fetchSingle = useServerFn(fetchSingleStock);
	const { data: livePrices = {} } = useQuery({
		queryKey: ["watchlist-prices", list.join(",")],
		queryFn: async () => {
			try {
				const prices = {};
				for (const sym of list) try {
					const result = await fetchSingle({ data: { symbol: sym } });
					if (result?.price) {
						const prevClose = result.prevClose;
						prices[sym] = {
							price: result.price,
							changePercent: prevClose ? (result.price - prevClose) / prevClose * 100 : 0,
							volume: result.volume || 0,
							high: result.high || 0,
							low: result.low || 0
						};
					}
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
	const items = list.map((sym) => {
		const staticStock = findStock(sym);
		const live = livePrices[sym];
		return {
			symbol: sym,
			name: staticStock?.name || sym,
			sector: staticStock?.sector || "Diğer",
			price: live?.price || staticStock?.price || 0,
			changePercent: live?.changePercent || staticStock?.change || 0,
			volume: live?.volume || staticStock?.volume || 0,
			pe: staticStock?.pe || 0,
			hasLivePrice: !!live
		};
	});
	const notAdded = stocks.filter((s) => !list.includes(s.symbol));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Takip Listem",
			subtitle: "Favori hisselerinizi buradan izleyin.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowAdd(!showAdd),
				className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Hisse Ekle"]
			})
		}),
		showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold mb-3",
				children: "Hisse Ekle"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [notAdded.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => toggle(s.symbol),
					className: "text-xs bg-secondary border border-border rounded-full px-3 py-1.5 hover:border-primary/40",
					children: ["+ ", s.symbol]
				}, s.symbol)), notAdded.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Tüm hisseler eklendi."
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: [items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/analiz",
							search: { symbol: s.symbol },
							className: "font-bold text-lg hover:text-primary",
							children: s.symbol
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: s.name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggle(s.symbol),
							className: "text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-baseline gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xl font-bold",
								children: [s.price.toFixed(2), " TL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-sm ${s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
								children: [
									s.changePercent >= 0 ? "+" : "",
									s.changePercent.toFixed(2),
									"%"
								]
							}),
							s.hasLivePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-[color:var(--success)] inline-block" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
							data: genLine(s.symbol.charCodeAt(0), 30, s.changePercent >= 0 ? "up" : "down"),
							color: s.changePercent >= 0 ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)",
							height: 60
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Hacim: ",
							(s.volume / 1e9).toFixed(1),
							" Mlr"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["F/K: ", s.pe.toFixed(1)] })]
					})
				]
			}, s.symbol)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-span-full text-center py-16 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-8 h-8 mx-auto mb-3 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Takip listeniz boş. Yukarıdan hisse ekleyin."
				})]
			})]
		})
	] });
}
//#endregion
export { TakipPage as component };
