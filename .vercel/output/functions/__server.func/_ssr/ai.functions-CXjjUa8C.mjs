import { r as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-B1CT3QFB.mjs";
import { O as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { i as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-CXjjUa8C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchIndexes = createServerFn({ method: "GET" }).validator(() => ({})).handler(createSsrRpc("97d4a5d90f0505cf485838fd66b67736faa191b6fc69d6da850f9cbf89958792"));
var fetchBistData = createServerFn({ method: "GET" }).validator(() => ({})).handler(createSsrRpc("02611667e118d7768acd40d062b055d1f63b1f4eecb4c1d65ad077422fa223b1"));
createServerFn({ method: "GET" }).validator((input) => {
	return { query: (input?.query || "").toUpperCase() };
}).handler(createSsrRpc("b0578e5ea9eef4e36911edd19d999d5ce815ce1ff3f23fd83ae39b54c3094725"));
var fetchSingleStock = createServerFn({ method: "GET" }).validator((input) => {
	return { symbol: (input?.symbol || "THYAO").toUpperCase() };
}).handler(createSsrRpc("4c2a4de449674d71ab726fb8036579d21f79a1c7179875c98cd834cd8d231f5f"));
var fetchStockHistory = createServerFn({ method: "GET" }).validator((input) => {
	const obj = input;
	return {
		symbol: (obj?.symbol || "THYAO").toUpperCase(),
		range: obj?.range || "1mo"
	};
}).handler(createSsrRpc("dd751f89693564f6afafd3fd4ccf2adadd782d82dfc0c7411e9aeaab94c51709"));
var fetchNews = createServerFn({ method: "GET" }).validator(() => ({})).handler(createSsrRpc("755d5e62c482d6cc8b24df5853d48c631a03ecbc391d3e0e67fb927c7cecd765"));
var fetchCalendar = createServerFn({ method: "GET" }).validator(() => ({})).handler(createSsrRpc("f81850fb6f5c19e5cd22f80e3b39179d64511896cbe7039bbc8ac03b8667d6bb"));
//#endregion
export { fetchSingleStock as a, fetchNews as i, fetchCalendar as n, fetchStockHistory as o, fetchIndexes as r, useServerFn as s, fetchBistData as t };
