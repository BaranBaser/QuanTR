import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as fetchCalendar, s as useServerFn } from "./ai.functions-CXjjUa8C.mjs";
import { m as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/takvim-DLzibCpS.js
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const fetchCalFn = useServerFn(fetchCalendar);
	const { data: events = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["calendar"],
		queryFn: async () => {
			try {
				return await fetchCalFn({});
			} catch {
				return [];
			}
		},
		staleTime: 6e5,
		throwOnError: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Ekonomik Takvim",
			subtitle: "Yaklaşan ekonomik veriler, faiz kararları ve önemli olaylar.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => refetch(),
				disabled: isFetching,
				className: "bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}` }), "Yenile"]
			})
		}),
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pulse text-muted-foreground",
				children: "Ekonomik takvim yükleniyor..."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm min-w-[600px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3 font-normal",
								children: "Tarih"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left font-normal",
								children: "Saat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left font-normal",
								children: "Ülke"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left font-normal",
								children: "Olay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-center font-normal",
								children: "Etki"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right font-normal",
								children: "Beklenti"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right font-normal pr-3",
								children: "Önceki"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: events.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border hover:bg-secondary/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 font-semibold",
							children: e.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-muted-foreground",
							children: e.time
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-lg",
							children: e.country
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-medium",
							children: e.event
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block w-2 h-2 rounded-full ${e.impact === "high" ? "bg-destructive" : e.impact === "medium" ? "bg-primary" : "bg-muted-foreground"}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block w-2 h-2 rounded-full mx-0.5 ${e.impact === "high" || e.impact === "medium" ? "bg-primary" : "bg-muted"}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block w-2 h-2 rounded-full ${e.impact === "high" ? "bg-destructive" : "bg-muted"}` })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right font-mono text-primary",
							children: e.forecast
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right font-mono text-muted-foreground pr-3",
							children: e.previous
						})
					]
				}, i)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4 text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-destructive inline-block" }), " Yüksek Etki"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-primary inline-block" }), " Orta Etki"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-muted-foreground inline-block" }), " Düşük Etki"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground",
			children: "Veriler FairEconomy API tarafından sağlanmaktadır."
		})
	] });
}
//#endregion
export { CalendarPage as component };
