import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analiz-5BcK_RW7.js
var $$splitComponentImporter = () => import("./analiz-C759FJW-.mjs");
var Route = createFileRoute("/analiz")({
	validateSearch: objectType({ symbol: stringType().optional() }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
