import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { s as useServerFn, t as fetchBistData } from "./ai.functions-CXjjUa8C.mjs";
import { D as ChartColumn, R as Activity, a as TrendingDown, i as TrendingUp, m as RefreshCw, t as Zap } from "../_libs/lucide-react.mjs";
import { c as stocks, n as PageHeader, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-BwB7IYKT.js
var import_jsx_runtime = require_jsx_runtime();
function MarketAnalysisPage() {
	const fetchFn = useServerFn(fetchBistData);
	const { data: liveData, isLoading, refetch, isFetching } = useQuery({
		queryKey: ["bist-live"],
		queryFn: async () => {
			try {
				return await fetchFn({});
			} catch {
				return [];
			}
		},
		staleTime: 6e4,
		refetchInterval: 12e4,
		throwOnError: false
	});
	const displayData = liveData && liveData.length > 0 ? liveData.map((d) => ({
		...d,
		change: d.change,
		changePercent: d.changePercent,
		sector: stocks.find((s) => s.symbol === d.symbol)?.sector || d.sector || "Diğer",
		marketCap: stocks.find((s) => s.symbol === d.symbol)?.marketCap || 0,
		pe: stocks.find((s) => s.symbol === d.symbol)?.pe || 0
	})) : stocks.map((s) => ({
		...s,
		change: s.change,
		changePercent: s.changePercent
	}));
	const gainers = [...displayData].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
	const losers = [...displayData].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
	const byVolume = [...displayData].sort((a, b) => b.volume - a.volume).slice(0, 5);
	const sectors = displayData.reduce((acc, s) => {
		const existing = acc.find((a) => a.name === s.sector);
		if (existing) {
			existing.stocks.push(s);
			existing.avgChange += s.changePercent;
		} else acc.push({
			name: s.sector,
			stocks: [s],
			avgChange: s.changePercent
		});
		return acc;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Piyasa Analizi",
			subtitle: "Canlı BIST verileri, en çok yükselenler, düşenler ve sektör analizi.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => refetch(),
				disabled: isFetching,
				className: "bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}` }), isFetching ? "Güncelleniyor..." : "Yenile"]
			})
		}),
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pulse text-muted-foreground",
				children: "Canlı veriler yükleniyor..."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-2",
				children: "Yahoo Finance'ten BIST verileri çekiliyor."
			})]
		}),
		liveData && liveData.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Canlı veri alınamadı (piyasa kapalı olabilir). Mock veriler gösteriliyor."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-[color:var(--success)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm",
							children: "En Çok Yükselenler"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: gainers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analiz",
							search: { symbol: s.symbol },
							className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: s.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: s.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-medium",
									children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-[color:var(--success)] font-semibold",
									children: [
										"+",
										typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.change,
										"%"
									]
								})]
							})]
						}, s.symbol))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm",
							children: "En Çok Düşenler"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: losers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analiz",
							search: { symbol: s.symbol },
							className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: s.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: s.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-medium",
									children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-destructive font-semibold",
									children: [typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.change, "%"]
								})]
							})]
						}, s.symbol))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm",
							children: "En Yüksek Hacim"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: byVolume.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analiz",
							search: { symbol: s.symbol },
							className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: s.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: s.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-medium",
									children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [(s.volume / 1e9).toFixed(2), " Mlr"]
								})]
							})]
						}, s.symbol))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "Sektör Analizi"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
				children: sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-sm",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `text-xs font-semibold ${s.avgChange >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
							children: [
								s.avgChange >= 0 ? "+" : "",
								(s.avgChange / s.stocks.length).toFixed(2),
								"%"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: s.stocks.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: st.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: st.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive",
								children: [
									st.changePercent >= 0 ? "+" : "",
									typeof st.changePercent === "number" ? st.changePercent.toFixed(2) : st.change,
									"%"
								]
							})]
						}, st.symbol))
					})]
				}, s.name))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "Tüm Hisseler"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
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
									className: "text-left font-normal",
									children: "Sektör"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Fiyat"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Değişim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "Hacim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal pr-3",
									children: "52H Aralığı"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: displayData.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border hover:bg-secondary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/analiz",
									search: { symbol: s.symbol },
									className: "font-semibold hover:text-primary",
									children: s.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: s.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-muted-foreground",
								children: s.sector
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right font-medium",
								children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive",
									children: [
										s.changePercent >= 0 ? "+" : "",
										typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.change,
										"%"
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right text-muted-foreground",
								children: [(s.volume / 1e9).toFixed(2), " Mlr"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right pr-3 text-muted-foreground",
								children: [
									s.low52,
									" - ",
									s.high52
								]
							})
						]
					}, s.symbol)) })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-primary/30 p-5 flex flex-wrap items-center justify-between gap-4",
			style: { background: "linear-gradient(90deg, oklch(0.22 0.05 82 / 0.5), oklch(0.18 0.01 260))" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: "Detaylı Hisse Analizi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Her hisse için teknik analiz ve grafikleri inceleyin."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/analiz",
				className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg px-5 py-3 hover:bg-primary/90",
				children: "Analiz Sayfasına Git"
			})]
		})
	] });
}
//#endregion
export { MarketAnalysisPage as component };
