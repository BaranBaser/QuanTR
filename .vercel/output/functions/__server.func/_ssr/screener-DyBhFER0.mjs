import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { s as useServerFn, t as fetchBistData } from "./ai.functions-CXjjUa8C.mjs";
import { D as ChartColumn, R as Activity, S as Funnel, a as TrendingDown, i as TrendingUp, m as RefreshCw, s as Target } from "../_libs/lucide-react.mjs";
import { c as stocks, n as PageHeader, r as SECTOR_MAP, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/screener-DyBhFER0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScreenerPage() {
	const [preset, setPreset] = (0, import_react.useState)("hepsi");
	const [sector, setSector] = (0, import_react.useState)("Tümü");
	const [minChange, setMinChange] = (0, import_react.useState)(-10);
	const [maxChange, setMaxChange] = (0, import_react.useState)(10);
	const [maxPE, setMaxPE] = (0, import_react.useState)(30);
	const [minPE, setMinPE] = (0, import_react.useState)(0);
	const [minVolume, setMinVolume] = (0, import_react.useState)(0);
	const [minPrice, setMinPrice] = (0, import_react.useState)(0);
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(1e3);
	const [onlyGainers, setOnlyGainers] = (0, import_react.useState)(false);
	const [onlyLosers, setOnlyLosers] = (0, import_react.useState)(false);
	const [near52Low, setNear52Low] = (0, import_react.useState)(false);
	const [near52High, setNear52High] = (0, import_react.useState)(false);
	const [sortBy, setSortBy] = (0, import_react.useState)("changePercent");
	const fetchBist = useServerFn(fetchBistData);
	const { data: liveData = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["bist-screener"],
		queryFn: async () => {
			try {
				return await fetchBist({});
			} catch {
				return [];
			}
		},
		staleTime: 6e4,
		refetchInterval: 12e4,
		throwOnError: false
	});
	const displayData = liveData.length > 0 ? liveData.map((d) => ({
		...d,
		sector: SECTOR_MAP[d.symbol] || "Diğer",
		pe: stocks.find((s) => s.symbol === d.symbol)?.pe || 0,
		marketCap: stocks.find((s) => s.symbol === d.symbol)?.marketCap || 0
	})) : stocks;
	const sectors = ["Tümü", ...Array.from(new Set(displayData.map((s) => s.sector)))];
	const filtered = (0, import_react.useMemo)(() => {
		let arr = [...displayData];
		if (preset === "düşükFk") arr = arr.filter((s) => s.pe > 0 && s.pe < 8);
		if (preset === "yüksekHacim") arr = arr.filter((s) => s.volume > 1e9);
		if (preset === "yükselen") arr = arr.filter((s) => s.changePercent > 0);
		if (preset === "52Hdüşük") arr = arr.filter((s) => s.price < s.low52 * 1.15);
		if (sector !== "Tümü") arr = arr.filter((s) => s.sector === sector);
		arr = arr.filter((s) => s.changePercent >= minChange && s.changePercent <= maxChange);
		arr = arr.filter((s) => s.pe >= minPE && s.pe <= maxPE);
		arr = arr.filter((s) => s.volume >= minVolume * 1e6);
		arr = arr.filter((s) => s.price >= minPrice && s.price <= maxPrice);
		if (onlyGainers) arr = arr.filter((s) => s.changePercent > 0);
		if (onlyLosers) arr = arr.filter((s) => s.changePercent < 0);
		if (near52Low) arr = arr.filter((s) => s.price < s.low52 * 1.15);
		if (near52High) arr = arr.filter((s) => s.price > s.high52 * .85);
		arr.sort((a, b) => {
			switch (sortBy) {
				case "changePercent": return b.changePercent - a.changePercent;
				case "volume": return b.volume - a.volume;
				case "price": return b.price - a.price;
				case "pe": return a.pe - b.pe;
				default: return 0;
			}
		});
		return arr;
	}, [
		preset,
		sector,
		minChange,
		maxChange,
		minPE,
		maxPE,
		minVolume,
		minPrice,
		maxPrice,
		onlyGainers,
		onlyLosers,
		near52Low,
		near52High,
		sortBy,
		displayData
	]);
	const resetFilters = () => {
		setPreset("hepsi");
		setSector("Tümü");
		setMinChange(-10);
		setMaxChange(10);
		setMaxPE(30);
		setMinPE(0);
		setMinVolume(0);
		setMinPrice(0);
		setMaxPrice(1e3);
		setOnlyGainers(false);
		setOnlyLosers(false);
		setNear52Low(false);
		setNear52High(false);
		setSortBy("changePercent");
	};
	const SectorBar = () => {
		const sectorCounts = displayData.reduce((acc, s) => {
			acc[s.sector] = (acc[s.sector] || 0) + 1;
			return acc;
		}, {});
		const maxCount = Math.max(1, ...Object.values(sectorCounts));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-20 text-xs text-muted-foreground truncate",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 h-1.5 bg-secondary rounded-full overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary/60 rounded-full",
							style: { width: `${count / maxCount * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 text-xs text-right text-muted-foreground",
						children: count
					})
				]
			}, name))
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Hisse Screener",
			subtitle: `${displayData.length} hisse içinden kriterlerinize göre filtreleyin.`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => refetch(),
				disabled: isFetching,
				className: "bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}` }), "Yenile"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				{
					k: "hepsi",
					l: "Tümü",
					icon: ChartColumn
				},
				{
					k: "düşükFk",
					l: "Düşük F/K (<8)",
					icon: Target
				},
				{
					k: "yüksekHacim",
					l: "Yüksek Hacim (>1 Mlr)",
					icon: Activity
				},
				{
					k: "yükselen",
					l: "Yükselenler",
					icon: TrendingUp
				},
				{
					k: "52Hdüşük",
					l: "52H Düşüğünde",
					icon: TrendingDown
				},
				{
					k: "teknoloji",
					l: "Teknoloji",
					icon: Funnel
				},
				{
					k: "bankacılık",
					l: "Bankacılık",
					icon: Funnel
				}
			].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setPreset(p.k);
					if (p.k === "teknoloji") {
						setSector("Teknoloji");
						setSortBy("changePercent");
					} else if (p.k === "bankacılık") {
						setSector("Bankacılık");
						setSortBy("changePercent");
					} else if (p.k === "düşükFk") {
						setSector("Tümü");
						setSortBy("pe");
					} else if (p.k === "yüksekHacim") {
						setSector("Tümü");
						setSortBy("volume");
					} else if (p.k === "yükselen") {
						setSector("Tümü");
						setSortBy("changePercent");
					} else if (p.k === "52Hdüşük") {
						setSector("Tümü");
						setSortBy("price");
					} else {
						setSector("Tümü");
						setSortBy("changePercent");
					}
				},
				className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${preset === p.k ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:border-primary/40"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "w-3.5 h-3.5" }), p.l]
			}, p.k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-4 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-sm",
									children: "Filtreler"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: resetFilters,
								className: "text-xs text-primary hover:underline",
								children: "Sıfırla"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-foreground",
									children: "Sektör"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: sector,
									onChange: (e) => setSector(e.target.value),
									className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm",
									children: sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground",
									children: [
										"Fiyat Aralığı: ",
										minPrice,
										" - ",
										maxPrice,
										" TL"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: minPrice,
										onChange: (e) => setMinPrice(+e.target.value),
										className: "w-1/2 bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs",
										placeholder: "Min"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: maxPrice,
										onChange: (e) => setMaxPrice(+e.target.value),
										className: "w-1/2 bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs",
										placeholder: "Max"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground",
									children: [
										"Değişim: ",
										minChange,
										"% — ",
										maxChange,
										"%"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -10,
										max: 10,
										step: .5,
										value: minChange,
										onChange: (e) => setMinChange(+e.target.value),
										className: "w-1/2 accent-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -10,
										max: 10,
										step: .5,
										value: maxChange,
										onChange: (e) => setMaxChange(+e.target.value),
										className: "w-1/2 accent-primary"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground",
									children: [
										"F/K Oranı: ",
										minPE,
										" — ",
										maxPE
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 30,
										value: minPE,
										onChange: (e) => setMinPE(+e.target.value),
										className: "w-1/2 accent-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 1,
										max: 50,
										value: maxPE,
										onChange: (e) => setMaxPE(+e.target.value),
										className: "w-1/2 accent-primary"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground",
									children: [
										"Min. Hacim: ",
										minVolume,
										" Mn TL"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 5e3,
									step: 100,
									value: minVolume,
									onChange: (e) => setMinVolume(+e.target.value),
									className: "w-full accent-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: onlyGainers,
												onChange: (e) => {
													setOnlyGainers(e.target.checked);
													setOnlyLosers(false);
												},
												className: "accent-primary"
											}), "Sadece Yükselenler"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: onlyLosers,
												onChange: (e) => {
													setOnlyLosers(e.target.checked);
													setOnlyGainers(false);
												},
												className: "accent-primary"
											}), "Sadece Düşenler"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: near52Low,
												onChange: (e) => {
													setNear52Low(e.target.checked);
													setNear52High(false);
												},
												className: "accent-primary"
											}), "52 Hafta Düşüğünde"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: near52High,
												onChange: (e) => {
													setNear52High(e.target.checked);
													setNear52Low(false);
												},
												className: "accent-primary"
											}), "52 Hafta Zirvesinde"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-foreground",
									children: "Sıralama"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sortBy,
									onChange: (e) => setSortBy(e.target.value),
									className: "w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "changePercent",
											children: "Değişim (%)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "volume",
											children: "Hacim"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "price",
											children: "Fiyat"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pe",
											children: "F/K Oranı"
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 border-t border-border mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-bold text-primary",
									children: filtered.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "hisse eşleşti"
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-sm mb-3",
						children: "Sektör Dağılımı"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectorBar, {})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden",
				children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-muted-foreground text-sm animate-pulse",
					children: "Canlı veriler yükleniyor..."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border bg-secondary/30",
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
										className: "text-right font-normal",
										children: "F/K"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right font-normal",
										children: "52H"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border hover:bg-secondary/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/analiz",
										search: { symbol: s.symbol },
										className: "font-semibold hover:text-primary",
										children: s.symbol
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground truncate max-w-[100px]",
										children: s.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-muted-foreground text-xs",
									children: s.sector
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-right",
									children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-semibold ${s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
										children: [
											s.changePercent >= 0 ? "+" : "",
											typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.changePercent,
											"%"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-right text-muted-foreground text-xs",
									children: [(s.volume / 1e6).toFixed(0), " Mn"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-right text-xs",
									children: s.pe > 0 ? s.pe.toFixed(1) : "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-right text-xs text-muted-foreground",
									children: [
										s.low52,
										" - ",
										s.high52
									]
								})
							]
						}, s.symbol)), filtered.length === 0 && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "p-8 text-center text-muted-foreground text-sm",
							children: "Eşleşen hisse bulunamadı."
						}) })] })]
					})
				})]
			})]
		})
	] });
}
//#endregion
export { ScreenerPage as component };
