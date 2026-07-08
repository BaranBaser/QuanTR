//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B1CT3QFB.js
var manifest = {
	"02611667e118d7768acd40d062b055d1f63b1f4eecb4c1d65ad077422fa223b1": {
		functionName: "fetchBistData_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	},
	"4c2a4de449674d71ab726fb8036579d21f79a1c7179875c98cd834cd8d231f5f": {
		functionName: "fetchSingleStock_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	},
	"755d5e62c482d6cc8b24df5853d48c631a03ecbc391d3e0e67fb927c7cecd765": {
		functionName: "fetchNews_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	},
	"97d4a5d90f0505cf485838fd66b67736faa191b6fc69d6da850f9cbf89958792": {
		functionName: "fetchIndexes_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	},
	"b0578e5ea9eef4e36911edd19d999d5ce815ce1ff3f23fd83ae39b54c3094725": {
		functionName: "fetchStockByQuery_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	},
	"dd751f89693564f6afafd3fd4ccf2adadd782d82dfc0c7411e9aeaab94c51709": {
		functionName: "fetchStockHistory_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	},
	"f81850fb6f5c19e5cd22f80e3b39179d64511896cbe7039bbc8ac03b8667d6bb": {
		functionName: "fetchCalendar_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BMhBG-cy.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
