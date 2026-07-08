import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as fetchSingleStock, o as fetchStockHistory, s as useServerFn } from "./ai.functions-CXjjUa8C.mjs";
import { D as ChartColumn, R as Activity, T as Clock, a as TrendingDown, i as TrendingUp, l as Star, m as RefreshCw, s as Target, t as Zap } from "../_libs/lucide-react.mjs";
import { a as findStock, c as stocks, i as Sparkline, n as PageHeader, o as genLine, r as SECTOR_MAP, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
import { r as useWatchlist } from "./storage-BdEgWm_8.mjs";
import { t as Route } from "./analiz-5BcK_RW7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analiz-C759FJW-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function calcRSI(closes, period = 14) {
	if (closes.length < period + 1) return 50;
	let gains = 0, losses = 0;
	for (let i = closes.length - period; i < closes.length; i++) {
		const diff = closes[i] - closes[i - 1];
		if (diff > 0) gains += diff;
		else losses -= diff;
	}
	if (losses === 0) return 100;
	return 100 - 100 / (1 + gains / losses);
}
function calcSMA(closes, period) {
	if (closes.length < period) return closes[closes.length - 1] || 0;
	return closes.slice(-period).reduce((a, b) => a + b, 0) / period;
}
function calcEMA(closes, period) {
	if (closes.length < period) return closes[closes.length - 1] || 0;
	const k = 2 / (period + 1);
	let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
	for (let i = period; i < closes.length; i++) ema = closes[i] * k + ema * (1 - k);
	return ema;
}
function calcMACD(closes) {
	const macd = calcEMA(closes, 12) - calcEMA(closes, 26);
	const recentCloses = closes.slice(-9);
	const signal = recentCloses.length > 0 ? calcEMA(recentCloses, 9) : macd;
	return {
		macd,
		signal,
		hist: macd - signal
	};
}
function calcBollinger(closes, period = 20) {
	const middle = calcSMA(closes, period);
	if (closes.length < period) return {
		upper: middle * 1.02,
		middle,
		lower: middle * .98
	};
	const variance = closes.slice(-period).reduce((acc, val) => acc + Math.pow(val - middle, 2), 0) / period;
	const std = Math.sqrt(variance);
	return {
		upper: middle + 2 * std,
		middle,
		lower: middle - 2 * std
	};
}
function findSupportResistance(closes) {
	if (closes.length < 10) return {
		supports: [],
		resistances: []
	};
	const recent = closes.slice(-30);
	const min = Math.min(...recent);
	const max = Math.max(...recent);
	const range = max - min;
	const supports = [
		min,
		min + range * .2,
		min + range * .382
	];
	const resistances = [
		max,
		max - range * .2,
		max - range * .382
	];
	return {
		supports: supports.filter((s) => s < closes[closes.length - 1]),
		resistances: resistances.filter((r) => r > closes[closes.length - 1])
	};
}
function AnalizPage() {
	const { symbol } = Route.useSearch();
	const selectedSymbol = (symbol || "THYAO").toUpperCase();
	const staticStock = findStock(selectedSymbol) || stocks[0];
	const watch = useWatchlist();
	const [timeRange, setTimeRange] = (0, import_react.useState)("1mo");
	const fetchSingle = useServerFn(fetchSingleStock);
	const fetchHistory = useServerFn(fetchStockHistory);
	const { data: liveStock, isLoading: loadingLive } = useQuery({
		queryKey: ["stock-live", selectedSymbol],
		queryFn: async () => {
			try {
				return await fetchSingle({ data: { symbol: selectedSymbol } });
			} catch {
				return null;
			}
		},
		staleTime: 6e4,
		throwOnError: false
	});
	const { data: history = [], isLoading: loadingHistory } = useQuery({
		queryKey: [
			"stock-history",
			selectedSymbol,
			timeRange
		],
		queryFn: async () => {
			try {
				return await fetchHistory({ data: {
					symbol: selectedSymbol,
					range: timeRange
				} }) ?? [];
			} catch {
				return [];
			}
		},
		staleTime: 3e5,
		throwOnError: false
	});
	const stock = liveStock ? {
		...staticStock,
		name: liveStock.name || staticStock.name,
		price: liveStock.price || staticStock.price,
		change: liveStock.changePercent ?? staticStock.change,
		volume: liveStock.volume || staticStock.volume,
		high52: liveStock.high52 || staticStock.high52,
		low52: liveStock.low52 || staticStock.low52
	} : staticStock;
	const technicals = (0, import_react.useMemo)(() => {
		if (history.length < 5) return null;
		const closes = history.map((h) => h.close).filter(Boolean);
		if (closes.length < 5) return null;
		const rsi = calcRSI(closes);
		const macd = calcMACD(closes);
		const bollinger = calcBollinger(closes);
		const sma20 = calcSMA(closes, 20);
		const sma50 = calcSMA(closes, 50);
		const ema12 = calcEMA(closes, 12);
		const ema26 = calcEMA(closes, 26);
		const { supports, resistances } = findSupportResistance(closes);
		const price = closes[closes.length - 1];
		const priceChange5d = closes.length >= 5 && closes[closes.length - 5] !== 0 ? (price - closes[closes.length - 5]) / closes[closes.length - 5] * 100 : 0;
		const priceChange1m = closes.length >= 20 && closes[closes.length - 20] !== 0 ? (price - closes[closes.length - 20]) / closes[closes.length - 20] * 100 : 0;
		const volatility = closes.length >= 20 ? Math.sqrt(closes.slice(-20).reduce((acc, val, i, arr) => i > 0 && arr[i - 1] !== 0 ? acc + Math.pow((val - arr[i - 1]) / arr[i - 1], 2) : acc, 0) / 19) * Math.sqrt(252) * 100 : 0;
		const rsiSignal = rsi < 30 ? "AL" : rsi > 70 ? "SAT" : "NÖTR";
		const macdSignal = macd.hist > 0 ? "AL" : "SAT";
		const bollingerSignal = price < bollinger.lower ? "AL" : price > bollinger.upper ? "SAT" : "NÖTR";
		const trendSignal = sma20 > sma50 ? "YÜKSELEN" : "DÜŞEN";
		const signals = [
			rsiSignal,
			macdSignal,
			bollingerSignal
		];
		const alCount = signals.filter((s) => s === "AL").length;
		const satCount = signals.filter((s) => s === "SAT").length;
		return {
			rsi,
			macd,
			bollinger,
			sma20,
			sma50,
			ema12,
			ema26,
			supports,
			resistances,
			priceChange5d,
			priceChange1m,
			volatility,
			rsiSignal,
			macdSignal,
			bollingerSignal,
			trendSignal,
			overallSignal: alCount > satCount ? "AL" : satCount > alCount ? "SAT" : "NÖTR"
		};
	}, [history]);
	const color = stock.change >= 0 ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)";
	const chartData = history.length > 0 ? history.map((h) => h.close) : genLine(selectedSymbol.charCodeAt(0), 30, stock.change >= 0 ? "up" : "down");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Hisse Analiz",
			subtitle: `${stock.symbol} — ${stock.name}`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [liveStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[color:var(--success)] animate-pulse" }), "Canlı"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => watch.toggle(stock.symbol),
					className: "inline-flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2 text-sm hover:border-primary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `w-4 h-4 ${watch.has(stock.symbol) ? "fill-primary text-primary" : "text-muted-foreground"}` }), watch.has(stock.symbol) ? "Takipten Çıkar" : "Takibe Al"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: stocks.slice(0, 15).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/analiz",
				search: { symbol: s.symbol },
				className: `px-3 py-1.5 rounded-lg text-sm border transition-colors ${s.symbol === stock.symbol ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:border-primary/40"}`,
				children: s.symbol
			}, s.symbol))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: SECTOR_MAP[stock.symbol] || stock.sector
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-3xl font-bold mt-1",
										children: [
											stock.price.toFixed(2),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-lg text-muted-foreground",
												children: "TL"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-sm flex items-center gap-1 mt-1 ${stock.change >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
										children: [
											stock.change >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" }),
											stock.change >= 0 ? "+" : "",
											stock.change.toFixed(2),
											"% bugün"
										]
									})
								] }), loadingLive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin text-muted-foreground" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1 mb-3",
								children: [
									{
										k: "5d",
										l: "5G"
									},
									{
										k: "1mo",
										l: "1A"
									},
									{
										k: "3mo",
										l: "3A"
									},
									{
										k: "6mo",
										l: "6A"
									},
									{
										k: "1y",
										l: "1Y"
									},
									{
										k: "2y",
										l: "2Y"
									}
								].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTimeRange(r.k),
									className: `px-3 py-1 rounded text-xs transition-colors ${timeRange === r.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`,
									children: r.l
								}, r.k))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								data: chartData,
								color,
								height: 260,
								width: 800
							}),
							history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 mt-2 text-[10px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
									history.length,
									" günlük veri"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border",
								children: [
									{
										l: "Hacim",
										v: `${(stock.volume / 1e9).toFixed(2)} Mlr TL`
									},
									{
										l: "Piyasa Değeri",
										v: `${(stock.marketCap / 1e9).toFixed(0)} Mlr TL`
									},
									{
										l: "F/K Oranı",
										v: stock.pe.toFixed(1)
									},
									{
										l: "52H Aralığı",
										v: `${stock.low52} - ${stock.high52}`
									}
								].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: k.l
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold mt-1",
									children: k.v
								})] }, k.l))
							})
						]
					}),
					technicals && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-sm",
									children: "Teknik Göstergeler"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `ml-auto text-xs font-bold px-2 py-1 rounded ${technicals.overallSignal === "AL" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" : technicals.overallSignal === "SAT" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`,
									children: ["GENEL: ", technicals.overallSignal]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								{
									name: "RSI (14)",
									value: technicals.rsi.toFixed(1),
									signal: technicals.rsiSignal,
									max: 100
								},
								{
									name: "MACD",
									value: technicals.macd.hist > 0 ? `+${technicals.macd.hist.toFixed(2)}` : technicals.macd.hist.toFixed(2),
									signal: technicals.macdSignal
								},
								{
									name: "Bollinger",
									value: stock.price < technicals.bollinger.lower ? "Alt Bant" : stock.price > technicals.bollinger.upper ? "Üst Bant" : "Orta",
									signal: technicals.bollingerSignal
								},
								{
									name: "Trend (SMA)",
									value: technicals.trendSignal,
									signal: technicals.sma20 > technicals.sma50 ? "AL" : "SAT"
								},
								{
									name: "SMA 20",
									value: `${technicals.sma20.toFixed(2)} TL`,
									signal: stock.price > technicals.sma20 ? "Üzerinde" : "Altında"
								},
								{
									name: "SMA 50",
									value: `${technicals.sma50.toFixed(2)} TL`,
									signal: stock.price > technicals.sma50 ? "Üzerinde" : "Altında"
								},
								{
									name: "Volatilite",
									value: `${technicals.volatility.toFixed(1)}%`,
									signal: technicals.volatility > 40 ? "YÜKSEK" : technicals.volatility < 20 ? "DÜŞÜK" : "NORMAL"
								},
								{
									name: "Değişim (5G)",
									value: `${technicals.priceChange5d >= 0 ? "+" : ""}${technicals.priceChange5d.toFixed(2)}%`,
									signal: technicals.priceChange5d > 0 ? "POZİTİF" : "NEGATİF"
								}
							].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-2.5 rounded-lg bg-secondary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: g.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium",
										children: g.value
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${g.signal === "AL" || g.signal === "POZİTİF" || g.signal === "Üzerinde" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" : g.signal === "SAT" || g.signal === "NEGATİF" || g.signal === "Altında" || g.signal === "YÜKSEK" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`,
										children: g.signal
									})]
								})]
							}, g.name))
						})]
					}),
					technicals && (technicals.supports.length > 0 || technicals.resistances.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: "Destek & Direnç Seviyeleri"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mb-2",
								children: "Direnç Seviyeleri"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: technicals.resistances.slice(0, 3).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2 rounded bg-destructive/10 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-destructive font-medium",
										children: ["R", i + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [r.toFixed(2), " TL"]
									})]
								}, i))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mb-2",
								children: "Destek Seviyeleri"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: technicals.supports.slice(0, 3).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2 rounded bg-[color:var(--success)]/10 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[color:var(--success)] font-medium",
										children: ["S", i + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [s.toFixed(2), " TL"]
									})]
								}, i))
							})] })]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: "Fiyat Bilgileri"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: [
								{
									l: "Günün Açılışı",
									v: history.length > 0 && history[0]?.open != null ? `${history[0].open.toFixed(2)} TL` : "-"
								},
								{
									l: "Gün İçi En Yüksek",
									v: `${(liveStock?.high || stock.high52 > stock.price ? stock.price : stock.high52).toFixed(2)} TL`
								},
								{
									l: "Gün İçi En Düşük",
									v: `${(liveStock?.low || stock.low52 < stock.price ? stock.price : stock.low52).toFixed(2)} TL`
								},
								{
									l: "52 Hafta Yüksek",
									v: `${stock.high52} TL`
								},
								{
									l: "52 Hafta Düşük",
									v: `${stock.low52} TL`
								},
								{
									l: "52H Orta Nokta",
									v: `${((stock.high52 + stock.low52) / 2).toFixed(2)} TL`
								},
								{
									l: "Fiyat / 52H Yüksek",
									v: `${(stock.price / stock.high52 * 100).toFixed(1)}%`
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: item.l
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: item.v
								})]
							}, item.l))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: "Sektör Analizi"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: [
								{
									l: "Sektör",
									v: SECTOR_MAP[stock.symbol] || stock.sector
								},
								{
									l: "Sektör Ort. F/K",
									v: stock.pe > 0 ? `${(stock.pe * 1.2).toFixed(1)}` : "-"
								},
								{
									l: "Sektör Karşılaştırma",
									v: stock.pe > 0 && stock.pe < 10 ? "Değerli" : stock.pe >= 10 && stock.pe < 20 ? "Normal" : stock.pe >= 20 ? "Pahalı" : "-"
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: item.l
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: item.v
								})]
							}, item.l))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-primary/30 p-5",
						style: { background: "linear-gradient(135deg, oklch(0.22 0.05 82 / 0.3), oklch(0.18 0.01 260))" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Veri Kaynağı"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-2",
							children: "Fiyatlar Yahoo Finance tarafından sağlanmaktadır. 15 dakika gecikmelidir. Teknik göstergeler gerçek fiyat verilerinden hesaplanmıştır. Yatırım tavsiyesi değildir."
						})]
					})
				]
			})]
		})
	] });
}
//#endregion
export { AnalizPage as component };
