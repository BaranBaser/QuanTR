import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as fetchNews, r as fetchIndexes, s as useServerFn, t as fetchBistData } from "./ai.functions-CXjjUa8C.mjs";
import { D as ChartColumn, I as ArrowRight, R as Activity, a as TrendingDown, i as TrendingUp, u as Sparkles, w as Crown } from "../_libs/lucide-react.mjs";
import { c as stocks, i as Sparkline, o as genLine, r as SECTOR_MAP, s as stockbear_logo_default, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-It3ZZyGD.js
var import_jsx_runtime = require_jsx_runtime();
var hero_bull_ai_default = "/assets/hero-bull-ai-peaDWtaM.jpg";
function Dashboard() {
	const fetchIdx = useServerFn(fetchIndexes);
	const fetchBist = useServerFn(fetchBistData);
	const fetchNewsFn = useServerFn(fetchNews);
	const { data: indexes = [], isLoading: loadingIdx } = useQuery({
		queryKey: ["indexes"],
		queryFn: async () => {
			try {
				return await fetchIdx({});
			} catch {
				return [];
			}
		},
		staleTime: 6e4,
		refetchInterval: 12e4,
		throwOnError: false
	});
	const { data: bistData = [], isLoading: loadingBist } = useQuery({
		queryKey: ["bist-home"],
		queryFn: async () => {
			try {
				return await fetchBist({});
			} catch {
				return [];
			}
		},
		staleTime: 6e4,
		throwOnError: false
	});
	const { data: news = [] } = useQuery({
		queryKey: ["news-home"],
		queryFn: async () => {
			try {
				return await fetchNewsFn({});
			} catch {
				return [];
			}
		},
		staleTime: 3e5,
		throwOnError: false
	});
	const displayStocks = bistData.length > 0 ? bistData.map((d) => ({
		...d,
		change: d.change,
		changePercent: d.changePercent,
		sector: SECTOR_MAP[d.symbol] || "Diğer"
	})) : stocks.slice(0, 10).map((s) => ({
		...s,
		change: s.change,
		changePercent: s.changePercent,
		sector: s.sector
	}));
	const displayIndexes = indexes.length > 0 ? indexes : [
		{
			name: "BIST 100",
			value: 0,
			changePercent: 0,
			symbol: "",
			change: 0,
			prevClose: 0,
			high: 0,
			low: 0
		},
		{
			name: "S&P 500",
			value: 0,
			changePercent: 0,
			symbol: "",
			change: 0,
			prevClose: 0,
			high: 0,
			low: 0
		},
		{
			name: "NASDAQ",
			value: 0,
			changePercent: 0,
			symbol: "",
			change: 0,
			prevClose: 0,
			high: 0,
			low: 0
		},
		{
			name: "DOLAR/TL",
			value: 0,
			changePercent: 0,
			symbol: "",
			change: 0,
			prevClose: 0,
			high: 0,
			low: 0
		},
		{
			name: "ALTIN",
			value: 0,
			changePercent: 0,
			symbol: "",
			change: 0,
			prevClose: 0,
			high: 0,
			low: 0
		}
	];
	const formatVal = (name, val) => {
		if (name.includes("DOLAR") || name.includes("EUR")) return val.toFixed(4);
		if (name.includes("ALTIN")) return val.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
		return val.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
	};
	const sectors = displayStocks.reduce((acc, s) => {
		const sector = s.sector;
		const existing = acc.find((a) => a.name === sector);
		if (existing) {
			existing.stocks.push(s);
			existing.avgChange += s.changePercent;
		} else acc.push({
			name: sector,
			stocks: [s],
			avgChange: s.changePercent
		});
		return acc;
	}, []);
	sectors.forEach((s) => {
		s.avgChange /= s.stocks.length;
	});
	const gainers = [...displayStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
	const losers = [...displayStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
	const highVolume = [...displayStocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative rounded-2xl border border-border bg-card overflow-hidden p-8 md:p-10",
			style: { background: "linear-gradient(135deg, oklch(0.18 0.01 260), oklch(0.16 0.02 60 / 0.6))" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-6 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-4xl md:text-5xl font-bold leading-tight",
						children: [
							"Hisse Analizi",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Gerçek Veri"
							}),
							" ile"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground mt-4",
						children: [
							"Yahoo Finance'ten canlı BIST verileri. ",
							displayStocks.length,
							"+ hisse, teknik analiz, sektör analizi. Veriyi anlayın, fırsatı yakalayın."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analiz",
							className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg px-5 py-3 hover:bg-primary/90",
							style: { boxShadow: "var(--shadow-gold)" },
							children: ["Hisse Analizine Başla ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ai",
							className: "inline-flex items-center gap-2 bg-secondary border border-border font-medium rounded-lg px-5 py-3 hover:bg-secondary/70",
							children: ["Piyasa Analizine Bak ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-primary" })]
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center md:justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_bull_ai_default,
						alt: "Borsa analizi",
						width: 1024,
						height: 1024,
						className: "w-full max-w-sm rounded-2xl"
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
			children: displayIndexes.map((idx) => {
				const up = idx.changePercent >= 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-medium",
							children: idx.name
						}),
						loadingIdx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-secondary rounded animate-pulse mt-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold mt-1",
							children: formatVal(idx.name, idx.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `text-xs font-medium mt-1 ${up ? "text-[color:var(--success)]" : "text-destructive"}`,
							children: [
								up ? "+" : "",
								idx.changePercent.toFixed(2),
								"%"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 -mx-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								data: genLine(idx.name.charCodeAt(0), 20, up ? "up" : "down"),
								color: up ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)",
								height: 35
							})
						})
					]
				}, idx.name);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "Popüler Hisseler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/piyasa",
						className: "text-xs text-primary",
						children: [
							"Tümü (",
							displayStocks.length,
							" hisse)"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-xs text-muted-foreground text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "font-normal py-2",
								children: "Hisse"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "font-normal",
								children: "Sektör"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "font-normal text-right",
								children: "Fiyat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "font-normal text-right",
								children: "Günlük"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "font-normal text-right",
								children: "Hacim"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: displayStocks.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border hover:bg-secondary/40 cursor-pointer transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/analiz",
									search: { symbol: p.symbol },
									className: "font-semibold hover:text-primary",
									children: p.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: p.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-xs text-muted-foreground",
								children: SECTOR_MAP[p.symbol] || "Diğer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right",
								children: [typeof p.price === "number" ? p.price.toFixed(2) : p.price, " TL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: `text-right font-semibold ${p.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
								children: [
									p.changePercent >= 0 ? "+" : "",
									typeof p.changePercent === "number" ? p.changePercent.toFixed(2) : p.changePercent,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right text-muted-foreground text-xs",
								children: [(p.volume / 1e9).toFixed(2), " Mlr"]
							})
						]
					}, p.symbol)) })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "Son Haberler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/haberler",
						className: "text-xs text-primary",
						children: "Tümü"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [news.slice(0, 5).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: n.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "block rounded-lg bg-secondary/50 border border-border p-3 hover:border-primary/40 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground",
									children: n.tag
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: n.time
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium line-clamp-2",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground mt-1",
								children: n.source
							})
						]
					}, n.id)), news.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground text-center py-4",
						children: "Haberler yükleniyor..."
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-[color:var(--success)]" }), " En Çok Yükselenler"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ai",
							className: "text-xs text-primary",
							children: "Tümü"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: gainers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analiz",
							search: { symbol: s.symbol },
							className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: s.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: s.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-[color:var(--success)] font-semibold",
									children: [
										"+",
										typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.changePercent,
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
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4 text-destructive" }), " En Çok Düşenler"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ai",
							className: "text-xs text-primary",
							children: "Tümü"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: losers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analiz",
							search: { symbol: s.symbol },
							className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: s.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: s.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-destructive font-semibold",
									children: [typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.changePercent, "%"]
								})]
							})]
						}, s.symbol))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-primary" }), " Sektör Performansı"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: sectors.sort((a, b) => b.avgChange - a.avgChange).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									s.name,
									" (",
									s.stocks.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-semibold ${s.avgChange >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
								children: [
									s.avgChange >= 0 ? "+" : "",
									s.avgChange.toFixed(2),
									"%"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 bg-secondary rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full rounded-full ${s.avgChange >= 0 ? "bg-[color:var(--success)]" : "bg-destructive"}`,
								style: { width: `${Math.min(Math.abs(s.avgChange) * 20, 100)}%` }
							})
						})] }, s.name))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-primary" }), " En Yüksek Hacimli Hisseler"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/piyasa",
					className: "text-xs text-primary",
					children: "Tümünü Gör"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-3",
				children: highVolume.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/analiz",
					search: { symbol: s.symbol },
					className: "rounded-lg bg-secondary/50 border border-border p-3 hover:border-primary/40 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: s.symbol
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground mb-2",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium",
								children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-xs font-semibold ${s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
								children: [
									s.changePercent >= 0 ? "+" : "",
									typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.changePercent,
									"%"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] text-muted-foreground mt-1",
							children: [
								"Hacim: ",
								(s.volume / 1e9).toFixed(2),
								" Mlr"
							]
						})
					]
				}, s.symbol))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-primary/30 p-5 flex flex-wrap items-center justify-between gap-4",
			style: { background: "linear-gradient(90deg, oklch(0.22 0.05 82 / 0.5), oklch(0.18 0.01 260))" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-5 h-5 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: "Detaylı Hisse Analizi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [displayStocks.length, "+ hisse için teknik analiz, grafikler, RSI, MACD ve canlı fiyat verisi."]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/analiz",
				className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg px-5 py-3 hover:bg-primary/90",
				children: ["Analize Git ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: stockbear_logo_default,
						alt: "",
						width: 32,
						height: 32,
						className: "w-8 h-8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold",
						children: ["stock", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "bear"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex flex-wrap gap-6 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							children: "Hakkımızda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							children: "Gizlilik Politikası"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							children: "Kullanım Şartları"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							children: "İletişim"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						"Veri: Yahoo Finance | ",
						displayStocks.length,
						"+ hisse"
					]
				})
			]
		})
	] });
}
//#endregion
export { Dashboard as component };
