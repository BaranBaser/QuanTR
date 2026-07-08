import { r as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-BdEgWm_8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var WKEY = "stockbear.watchlist";
var PKEY = "stockbear.portfolio";
var AKEY = "stockbear.alarms";
function useWatchlist() {
	const [list, setList] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const raw = localStorage.getItem(WKEY);
		if (raw) try {
			setList(JSON.parse(raw));
		} catch {}
		else setList([
			"THYAO",
			"ASELS",
			"AKBNK"
		]);
	}, []);
	const save = (next) => {
		setList(next);
		localStorage.setItem(WKEY, JSON.stringify(next));
	};
	const toggle = (s) => save(list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);
	return {
		list,
		toggle,
		has: (s) => list.includes(s),
		save
	};
}
function usePortfolio() {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const raw = localStorage.getItem(PKEY);
		if (raw) try {
			setItems(JSON.parse(raw));
			return;
		} catch {}
		setItems([
			{
				symbol: "THYAO",
				lots: 100,
				avgPrice: 280
			},
			{
				symbol: "ASELS",
				lots: 500,
				avgPrice: 62
			},
			{
				symbol: "AKBNK",
				lots: 800,
				avgPrice: 48
			},
			{
				symbol: "KOZAL",
				lots: 300,
				avgPrice: 26
			}
		]);
	}, []);
	const save = (next) => {
		setItems(next);
		localStorage.setItem(PKEY, JSON.stringify(next));
	};
	const add = (p) => {
		const existing = items.find((x) => x.symbol === p.symbol);
		if (existing) {
			const totalLots = existing.lots + p.lots;
			const avg = (existing.lots * existing.avgPrice + p.lots * p.avgPrice) / totalLots;
			save(items.map((x) => x.symbol === p.symbol ? {
				...x,
				lots: totalLots,
				avgPrice: avg
			} : x));
		} else save([...items, p]);
	};
	const remove = (s) => save(items.filter((x) => x.symbol !== s));
	return {
		items,
		add,
		remove,
		save
	};
}
function useAlarms() {
	const [alarms, setAlarms] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const raw = localStorage.getItem(AKEY);
		if (raw) try {
			setAlarms(JSON.parse(raw));
		} catch {}
	}, []);
	const save = (next) => {
		setAlarms(next);
		localStorage.setItem(AKEY, JSON.stringify(next));
	};
	const add = (a) => {
		const newAlarm = {
			...a,
			id: Date.now().toString(36),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		save([...alarms, newAlarm]);
	};
	const remove = (id) => save(alarms.filter((a) => a.id !== id));
	const toggle = (id) => save(alarms.map((a) => a.id === id ? {
		...a,
		active: !a.active
	} : a));
	const check = (symbol, currentPrice) => {
		return alarms.filter((a) => a.symbol === symbol && a.active).map((a) => ({
			...a,
			triggered: a.type === "above" ? currentPrice >= a.targetPrice : currentPrice <= a.targetPrice
		}));
	};
	return {
		alarms,
		add,
		remove,
		toggle,
		check
	};
}
//#endregion
export { usePortfolio as n, useWatchlist as r, useAlarms as t };
