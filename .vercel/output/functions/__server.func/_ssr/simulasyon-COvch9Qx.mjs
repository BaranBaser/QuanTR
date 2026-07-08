import { r as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { N as Beaker, g as Play, p as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as findStock, c as stocks, i as Sparkline, n as PageHeader, o as genLine, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulasyon-COvch9Qx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SimPage() {
	const [balance, setBalance] = (0, import_react.useState)(1e5);
	const [initialBalance] = (0, import_react.useState)(1e5);
	const [day, setDay] = (0, import_react.useState)(1);
	const [portfolio, setPortfolio] = (0, import_react.useState)({});
	const [trades, setTrades] = (0, import_react.useState)([]);
	const [symbol, setSymbol] = (0, import_react.useState)("THYAO");
	const [lots, setLots] = (0, import_react.useState)(10);
	const stock = findStock(symbol);
	const dayPriceMultiplier = 1 + Math.sin(day * .5) * .05;
	const currentPrice = stock ? stock.price * dayPriceMultiplier : 0;
	const totalPortfolioValue = Object.entries(portfolio).reduce((sum, [sym, pos]) => {
		const s = findStock(sym);
		if (!s) return sum;
		return sum + s.price * dayPriceMultiplier * pos.lots;
	}, 0);
	const netWorth = balance + totalPortfolioValue;
	const returnPct = (netWorth - initialBalance) / initialBalance * 100;
	const buy = () => {
		if (!stock || balance < currentPrice * lots) return;
		const cost = currentPrice * lots;
		const existing = portfolio[symbol];
		const newLots = (existing?.lots || 0) + lots;
		const newAvg = existing ? (existing.avg * existing.lots + cost) / newLots : currentPrice;
		setPortfolio({
			...portfolio,
			[symbol]: {
				lots: newLots,
				avg: newAvg
			}
		});
		setBalance(balance - cost);
		setTrades([{
			day,
			symbol,
			type: "AL",
			lots,
			price: currentPrice
		}, ...trades]);
	};
	const sell = () => {
		if (!stock || !portfolio[symbol] || portfolio[symbol].lots < lots) return;
		const revenue = currentPrice * lots;
		const remaining = portfolio[symbol].lots - lots;
		const next = { ...portfolio };
		if (remaining === 0) delete next[symbol];
		else next[symbol] = {
			...next[symbol],
			lots: remaining
		};
		setPortfolio(next);
		setBalance(balance + revenue);
		setTrades([{
			day,
			symbol,
			type: "SAT",
			lots,
			price: currentPrice
		}, ...trades]);
	};
	const nextDay = () => setDay(day + 1);
	const reset = () => {
		setBalance(initialBalance);
		setDay(1);
		setPortfolio({});
		setTrades([]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Simülasyon",
			subtitle: "Gerçek para riski olmadan alım-satım pratiği yapın.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: reset,
				className: "bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" }), " Sıfırla"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Nakit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold mt-1",
						children: [balance.toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Portföy Değeri"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold mt-1",
						children: [totalPortfolioValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Net Değer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold mt-1",
						children: [netWorth.toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/30 bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Getiri (Gün ",
							day,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `text-2xl font-bold mt-1 ${returnPct >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
						children: [
							returnPct >= 0 ? "+" : "",
							returnPct.toFixed(2),
							"%"
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: stock?.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold",
						children: [
							symbol,
							" — ",
							currentPrice.toFixed(2),
							" TL"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: nextDay,
						className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4" }), " Sonraki Gün"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
					data: genLine(day * 7, 40, "flat"),
					color: "oklch(0.82 0.17 82)",
					height: 200,
					width: 600
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beaker, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: "İşlem Yap"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Hisse"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: symbol,
						onChange: (e) => setSymbol(e.target.value),
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm",
						children: stocks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s.symbol }, s.symbol))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Adet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: lots,
						onChange: (e) => setLots(+e.target.value),
						className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: ["Toplam: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-foreground",
							children: [(currentPrice * lots).toLocaleString("tr-TR", { maximumFractionDigits: 0 }), " TL"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: buy,
							className: "flex-1 bg-[color:var(--success)]/20 text-[color:var(--success)] rounded-lg py-2 text-sm font-semibold hover:bg-[color:var(--success)]/30",
							children: "AL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: sell,
							className: "flex-1 bg-destructive/20 text-destructive rounded-lg py-2 text-sm font-semibold hover:bg-destructive/30",
							children: "SAT"
						})]
					}),
					portfolio[symbol] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground pt-2 border-t border-border",
						children: [
							"Elinizde: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [portfolio[symbol].lots, " adet"]
							}),
							" (ort. ",
							portfolio[symbol].avg.toFixed(2),
							" TL)"
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-b border-border font-semibold text-sm",
				children: "İşlem Geçmişi"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "w-full text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [trades.slice(0, 20).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 text-muted-foreground text-xs",
								children: ["Gün ", t.day]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-semibold",
								children: t.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-bold px-2 py-0.5 rounded ${t.type === "AL" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" : "bg-destructive/20 text-destructive"}`,
								children: t.type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right",
								children: [t.lots, " adet"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right pr-3",
								children: [t.price.toFixed(2), " TL"]
							})
						]
					}, i)), trades.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "p-8 text-center text-muted-foreground text-sm",
						children: "Henüz işlem yapılmadı."
					}) })] })
				})
			})]
		})
	] });
}
//#endregion
export { SimPage as component };
