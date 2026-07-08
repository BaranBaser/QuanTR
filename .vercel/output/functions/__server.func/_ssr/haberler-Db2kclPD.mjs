import { r as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as fetchNews, s as useServerFn } from "./ai.functions-CXjjUa8C.mjs";
import { C as ExternalLink, m as RefreshCw, v as Newspaper } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppShell } from "./AppShell-Dj5JQaVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/haberler-Db2kclPD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tags = [
	"Tümü",
	"Ekonomi",
	"BIST",
	"Döviz",
	"Emtia",
	"Global",
	"Piyasa"
];
function NewsPage() {
	const [tag, setTag] = (0, import_react.useState)("Tümü");
	const [sourceFilter, setSourceFilter] = (0, import_react.useState)("Tümü");
	const fetchNewsFn = useServerFn(fetchNews);
	const { data: allNews = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["news"],
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
	const sources = ["Tümü", ...Array.from(new Set(allNews.map((n) => n.source)))];
	const filtered = allNews.filter((n) => {
		if (tag !== "Tümü" && n.tag !== tag) return false;
		if (sourceFilter !== "Tümü" && n.source !== sourceFilter) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Haberler",
			subtitle: "Piyasadan en güncel haberler ve gelişmeler.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => refetch(),
				disabled: isFetching,
				className: "bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}` }), "Yenile"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTag(t),
				className: `px-3 py-1.5 rounded-lg text-sm border ${tag === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:border-primary/40"}`,
				children: t
			}, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: sources.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setSourceFilter(s),
				className: `px-2 py-1 rounded text-xs border ${sourceFilter === s ? "bg-secondary text-foreground border-primary/40" : "bg-muted/50 border-border text-muted-foreground hover:border-primary/40"}`,
				children: s
			}, s))
		}),
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pulse text-muted-foreground",
				children: "Haberler yükleniyor..."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: n.url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "block rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [
						n.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: n.thumbnail,
							alt: "",
							className: "w-16 h-16 rounded-lg object-cover shrink-0",
							loading: "lazy"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${n.impact === "high" ? "bg-destructive/20 text-destructive" : n.impact === "medium" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap mb-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground",
										children: n.tag
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: n.source
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: n.time
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-base",
								children: n.title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4 text-muted-foreground shrink-0" })
					]
				})
			}, n.id)), !isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground text-sm",
				children: "Bu kategoride haber bulunamadı."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground",
			children: "Haberler Yahoo Finance tarafından sağlanmaktadır."
		})
	] });
}
//#endregion
export { NewsPage as component };
