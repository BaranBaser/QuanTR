import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { s as useServerFn, t as fetchBistData } from "./ai.functions-CXjjUa8C.mjs";
import { F as ArrowUpDown, L as ArrowDown, P as ArrowUp, a as TrendingDown, f as Search, i as TrendingUp, m as RefreshCw } from "../_libs/lucide-react.mjs";
import { c as stocks, i as Sparkline, n as PageHeader, o as genLine, r as SECTOR_MAP, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/piyasa-BWTkF0W_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PiyasaPage() {
	const [tab, setTab] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [sectorFilter, setSectorFilter] = (0, import_react.useState)("Tümü");
	const [sortKey, setSortKey] = (0, import_react.useState)("symbol");
	const [sortAsc, setSortAsc] = (0, import_react.useState)(true);
	const fetchBist = useServerFn(fetchBistData);
	const { data: liveData = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["bist-piyasa"],
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
		marketCap: stocks.find((s) => s.symbol === d.symbol)?.marketCap || 0,
		pe: stocks.find((s) => s.symbol === d.symbol)?.pe || 0
	})) : stocks;
	const sectors = ["Tümü", ...Array.from(new Set(displayData.map((s) => s.sector)))];
	const filtered = (0, import_react.useMemo)(() => {
		let arr = [...displayData];
		if (search) {
			const q = search.toUpperCase();
			arr = arr.filter((s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q));
		}
		if (sectorFilter !== "Tümü") arr = arr.filter((s) => s.sector === sectorFilter);
		if (tab === "gainers") arr = arr.filter((s) => s.changePercent > 0);
		if (tab === "losers") arr = arr.filter((s) => s.changePercent < 0);
		arr.sort((a, b) => {
			let av, bv;
			switch (sortKey) {
				case "symbol":
					av = a.symbol;
					bv = b.symbol;
					return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
				case "sector":
					av = a.sector;
					bv = b.sector;
					return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
				case "price":
					av = a.price;
					bv = b.price;
					break;
				case "changePercent":
					av = a.changePercent;
					bv = b.changePercent;
					break;
				case "volume":
					av = a.volume;
					bv = b.volume;
					break;
				case "high52":
					av = a.high52;
					bv = b.high52;
					break;
				case "low52":
					av = a.low52;
					bv = b.low52;
					break;
				default: return 0;
			}
			return sortAsc ? av - bv : bv - av;
		});
		return arr;
	}, [
		tab,
		search,
		sectorFilter,
		sortKey,
		sortAsc,
		displayData
	]);
	const handleSort = (key) => {
		if (sortKey === key) setSortAsc(!sortAsc);
		else {
			setSortKey(key);
			setSortAsc(true);
		}
	};
	const SortIcon = ({ k }) => {
		if (sortKey !== k) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3 opacity-30" });
		return sortAsc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-3 h-3 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3 h-3 text-primary" });
	};
	const gainers = displayData.filter((s) => s.changePercent > 0).length;
	const losers = displayData.filter((s) => s.changePercent < 0).length;
	const totalVol = displayData.reduce((a, b) => a + b.volume, 0);
	const avgChange = displayData.length > 0 ? displayData.reduce((a, b) => a + b.changePercent, 0) / displayData.length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Piyasa Özeti",
			subtitle: `${displayData.length} hisse — canlı fiyatlar, sektör analizi ve detaylı tablo.`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => refetch(),
				disabled: isFetching,
				className: "bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}` }), isFetching ? "Güncelleniyor..." : "Yenile"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-5 gap-4",
			children: [
				{
					label: "Toplam Hisse",
					value: displayData.length.toString(),
					sub: "BIST"
				},
				{
					label: "Yükselen",
					value: gainers.toString(),
					sub: "adet",
					up: true
				},
				{
					label: "Düşen",
					value: losers.toString(),
					sub: "adet",
					up: false
				},
				{
					label: "Toplam Hacim",
					value: `${(totalVol / 1e9).toFixed(1)} Mlr TL`,
					sub: "günlük"
				},
				{
					label: "Ort. Değişim",
					value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
					sub: "ortalama",
					up: avgChange >= 0
				}
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: k.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `text-2xl font-bold mt-1 ${k.up === true ? "text-[color:var(--success)]" : k.up === false ? "text-destructive" : ""}`,
						children: k.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: k.sub
					})
				]
			}, k.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-w-[200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "Hisse ara... (THY, ASELS, Garanti)",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-primary/60 focus:outline-none"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: sectorFilter,
				onChange: (e) => setSectorFilter(e.target.value),
				className: "bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm min-w-[160px]",
				children: sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-1 p-1 bg-secondary/50 rounded-xl w-fit",
			children: [
				{
					k: "all",
					l: `Tümü (${displayData.length})`
				},
				{
					k: "gainers",
					l: `Yükselen (${gainers})`
				},
				{
					k: "losers",
					l: `Düşen (${losers})`
				},
				{
					k: "volume",
					l: "En Yüksek Hacim"
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab(t.k),
				className: `px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${tab === t.k ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
				children: t.l
			}, t.k))
		}),
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pulse text-muted-foreground",
				children: "Canlı veriler yükleniyor... (48 hisse)"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left font-normal p-3 cursor-pointer hover:text-foreground",
									onClick: () => handleSort("symbol"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: ["Hisse ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { k: "symbol" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left font-normal cursor-pointer hover:text-foreground",
									onClick: () => handleSort("sector"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: ["Sektör ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { k: "sector" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal cursor-pointer hover:text-foreground",
									onClick: () => handleSort("price"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: ["Fiyat ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { k: "price" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal cursor-pointer hover:text-foreground",
									onClick: () => handleSort("changePercent"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: ["Değişim ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { k: "changePercent" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal cursor-pointer hover:text-foreground",
									onClick: () => handleSort("volume"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: ["Hacim ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { k: "volume" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "52H Düşük"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal",
									children: "52H Yüksek"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right font-normal pr-3",
									children: "Grafik"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
									className: "text-xs text-muted-foreground truncate max-w-[120px]",
									children: s.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-muted-foreground text-xs",
								children: s.sector
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right font-medium",
								children: [typeof s.price === "number" ? s.price.toFixed(2) : s.price, " TL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1 font-semibold ${s.changePercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
									children: [
										s.changePercent >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3 h-3" }),
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
								className: "text-right text-muted-foreground text-xs",
								children: s.low52
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right text-muted-foreground text-xs",
								children: s.high52
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right pr-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-20 inline-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
										data: genLine(i + 3, 16, s.changePercent >= 0 ? "up" : "down"),
										color: s.changePercent >= 0 ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)",
										height: 24,
										width: 80,
										fill: false
									})
								})
							})
						]
					}, s.symbol)), filtered.length === 0 && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 8,
						className: "p-8 text-center text-muted-foreground text-sm",
						children: "Aramanızla eşleşen hisse bulunamadı."
					}) })] })]
				})
			}), filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 border-t border-border text-xs text-muted-foreground text-right",
				children: [filtered.length, " hisse gösteriliyor"]
			})]
		})
	] });
}
//#endregion
export { PiyasaPage as component };
