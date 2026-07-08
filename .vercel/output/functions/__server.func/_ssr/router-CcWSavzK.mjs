import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as QueryClientProvider, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$12 } from "./analiz-5BcK_RW7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CcWSavzK.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CCLWzp0p.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Sayfa bulunamadı"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Aradığınız sayfa mevcut değil ya da taşınmış olabilir."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Ana Sayfa"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Bu sayfa yüklenemedi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Bir sorun oluştu. Yenilemeyi ya da ana sayfaya dönmeyi deneyin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tekrar dene"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ana Sayfa"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "stockbear — Yapay Zeka Destekli Hisse Analizi" },
			{
				name: "description",
				content: "Yapay zeka gücüyle hisse analizi, piyasa özeti, portföy takibi ve AI önerileri. Veriyi anlayın, fırsatı yakalayın."
			},
			{
				property: "og:title",
				content: "stockbear — Yapay Zeka Destekli Hisse Analizi"
			},
			{
				property: "og:description",
				content: "Yapay zeka gücüyle hisse analizi, piyasa özeti, portföy takibi ve AI önerileri."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "tr",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$10 = () => import("./takvim-DLzibCpS.mjs");
var Route$10 = createFileRoute("/takvim")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./takip-CNV2cYLD.mjs");
var Route$9 = createFileRoute("/takip")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./simulasyon-COvch9Qx.mjs");
var Route$8 = createFileRoute("/simulasyon")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./screener-DyBhFER0.mjs");
var Route$7 = createFileRoute("/screener")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./portfoy-ClS7Mw9G.mjs");
var Route$6 = createFileRoute("/portfoy")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./piyasa-BWTkF0W_.mjs");
var Route$5 = createFileRoute("/piyasa")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./haberler-Db2kclPD.mjs");
var Route$4 = createFileRoute("/haberler")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./ayarlar-LxW99c7A.mjs");
var Route$3 = createFileRoute("/ayarlar")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./alarm-Dwo8Ug6n.mjs");
var Route$2 = createFileRoute("/alarm")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./ai-BwB7IYKT.mjs");
var Route$1 = createFileRoute("/ai")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./routes-It3ZZyGD.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TakvimRoute = Route$10.update({
	id: "/takvim",
	path: "/takvim",
	getParentRoute: () => Route$11
});
var TakipRoute = Route$9.update({
	id: "/takip",
	path: "/takip",
	getParentRoute: () => Route$11
});
var SimulasyonRoute = Route$8.update({
	id: "/simulasyon",
	path: "/simulasyon",
	getParentRoute: () => Route$11
});
var ScreenerRoute = Route$7.update({
	id: "/screener",
	path: "/screener",
	getParentRoute: () => Route$11
});
var PortfoyRoute = Route$6.update({
	id: "/portfoy",
	path: "/portfoy",
	getParentRoute: () => Route$11
});
var PiyasaRoute = Route$5.update({
	id: "/piyasa",
	path: "/piyasa",
	getParentRoute: () => Route$11
});
var HaberlerRoute = Route$4.update({
	id: "/haberler",
	path: "/haberler",
	getParentRoute: () => Route$11
});
var AyarlarRoute = Route$3.update({
	id: "/ayarlar",
	path: "/ayarlar",
	getParentRoute: () => Route$11
});
var AnalizRoute = Route$12.update({
	id: "/analiz",
	path: "/analiz",
	getParentRoute: () => Route$11
});
var AlarmRoute = Route$2.update({
	id: "/alarm",
	path: "/alarm",
	getParentRoute: () => Route$11
});
var AiRoute = Route$1.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => Route$11
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	AiRoute,
	AlarmRoute,
	AnalizRoute,
	AyarlarRoute,
	HaberlerRoute,
	PiyasaRoute,
	PortfoyRoute,
	ScreenerRoute,
	SimulasyonRoute,
	TakipRoute,
	TakvimRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
