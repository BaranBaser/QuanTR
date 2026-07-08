import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-BMhBG-cy.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var YF_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
async function yfFetch(symbol, range = "1d", interval = "1d") {
	try {
		const url = `${YF_BASE}/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8e3);
		const res = await fetch(url, {
			headers: { "User-Agent": "Mozilla/5.0" },
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (!res.ok) return null;
		return (await res.json()).chart?.result?.[0] ?? null;
	} catch {
		return null;
	}
}
function parseMeta(result) {
	const meta = result?.meta;
	if (!meta) return null;
	const price = meta.regularMarketPrice ?? 0;
	const prevClose = meta.chartPreviousClose ?? 0;
	const change = price - prevClose;
	const changePercent = prevClose ? (price - prevClose) / prevClose * 100 : 0;
	return {
		symbol: meta.symbol,
		name: meta.shortName || meta.longName || meta.symbol,
		price,
		prevClose,
		change,
		changePercent,
		high: meta.regularMarketDayHigh ?? 0,
		low: meta.regularMarketDayLow ?? 0,
		volume: meta.regularMarketVolume ?? 0,
		high52: meta.fiftyTwoWeekHigh ?? 0,
		low52: meta.fiftyTwoWeekLow ?? 0
	};
}
var INDEX_SYMBOLS = [
	{
		name: "BIST 100",
		symbol: "XU100.IS"
	},
	{
		name: "S&P 500",
		symbol: "^GSPC"
	},
	{
		name: "NASDAQ",
		symbol: "^IXIC"
	},
	{
		name: "DOLAR/TL",
		symbol: "USDTRY=X"
	},
	{
		name: "ALTIN",
		symbol: "GC=F"
	},
	{
		name: "EUR/TRY",
		symbol: "EURTRY=X"
	}
];
var fetchIndexes_createServerFn_handler = createServerRpc({
	id: "97d4a5d90f0505cf485838fd66b67736faa191b6fc69d6da850f9cbf89958792",
	name: "fetchIndexes",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchIndexes.__executeServer(opts));
var fetchIndexes = createServerFn({ method: "GET" }).validator(() => ({})).handler(fetchIndexes_createServerFn_handler, async () => {
	return (await Promise.allSettled(INDEX_SYMBOLS.map(async (idx) => {
		const meta = parseMeta(await yfFetch(idx.symbol));
		if (!meta) return null;
		const change = meta.price - meta.prevClose;
		const changePercent = meta.prevClose ? change / meta.prevClose * 100 : 0;
		return {
			name: idx.name,
			symbol: idx.symbol,
			value: meta.price,
			change,
			changePercent,
			prevClose: meta.prevClose,
			high: meta.high,
			low: meta.low
		};
	}))).filter((r) => r.status === "fulfilled").map((r) => r.value).filter(Boolean);
});
var BIST_SYMBOLS = [
	"AKBNK",
	"GARAN",
	"YKBNK",
	"HALKB",
	"VAKBN",
	"ISCTR",
	"TSKB",
	"QNBFB",
	"SKBNK",
	"THYAO",
	"PGSUS",
	"TAVHL",
	"TUPRS",
	"PETKM",
	"ODAS",
	"AYDEM",
	"AKSEN",
	"ENJSA",
	"ENERY",
	"CWENE",
	"EUPWR",
	"ASTOR",
	"SAHOL",
	"KCHOL",
	"DOHOL",
	"BRYAT",
	"EUREN",
	"EREGL",
	"KRDMD",
	"SISE",
	"ARCLK",
	"ECILC",
	"BRSAN",
	"CIMSA",
	"CVKMD",
	"FROTO",
	"TOASO",
	"TTRAK",
	"DOAS",
	"TCELL",
	"TTKOM",
	"ASELS",
	"KOZAA",
	"KOZAL",
	"IHEVA",
	"SASA",
	"BRISA",
	"KONTR",
	"HEKTS",
	"AKSA",
	"BIMAS",
	"MGROS",
	"SOKM",
	"EKGYO",
	"GLYHO",
	"DAPGM",
	"PSGYO",
	"ISMEN",
	"ENKAI",
	"ALARK",
	"KONKA",
	"MAVI",
	"CANTE",
	"TGSAS",
	"AEFES",
	"CCOLA",
	"BTCIM",
	"VESTL",
	"EKOS",
	"FONET",
	"ANSGR",
	"TURSG",
	"FENER",
	"DSTKF",
	"EFOR",
	"OTKAR",
	"OYAKC",
	"GESAN",
	"GLRMK",
	"GRSEL",
	"GRTHO",
	"IEYHO",
	"IZENR",
	"KLRHO",
	"KTLEV",
	"KUYAS",
	"MAGEN",
	"MIATK",
	"MPARK",
	"OBAMS",
	"ODINE",
	"PAHOL",
	"PASEU",
	"PATEK",
	"QUAGR",
	"RALYH",
	"REEDR",
	"SMRTG",
	"TABGD",
	"TRENJ",
	"TRMET",
	"ALTNY",
	"BALSU",
	"BERA",
	"BSOKE",
	"ESEN",
	"GENIL"
];
var SECTOR_MAP = {
	AKBNK: "Bankacılık",
	GARAN: "Bankacılık",
	YKBNK: "Bankacılık",
	HALKB: "Bankacılık",
	VAKBN: "Bankacılık",
	ISCTR: "Bankacılık",
	TSKB: "Bankacılık",
	QNBFB: "Bankacılık",
	SKBNK: "Bankacılık",
	THYAO: "Havacılık",
	PGSUS: "Havacılık",
	TAVHL: "Havacılık",
	TUPRS: "Enerji",
	PETKM: "Enerji",
	ODAS: "Enerji",
	AYDEM: "Enerji",
	AKSEN: "Enerji",
	ENJSA: "Enerji",
	ENERY: "Enerji",
	CWENE: "Enerji",
	EUPWR: "Enerji",
	ASTOR: "Enerji",
	SAHOL: "Holding",
	KCHOL: "Holding",
	DOHOL: "Holding",
	BRYAT: "Holding",
	EUREN: "Holding",
	EREGL: "Metal",
	KRDMD: "Metal",
	SISE: "Sanayi",
	ARCLK: "Sanayi",
	ECILC: "Sanayi",
	BRSAN: "Sanayi",
	CIMSA: "Sanayi",
	CVKMD: "Sanayi",
	TOASO: "Otomotiv",
	FROTO: "Otomotiv",
	TTRAK: "Otomotiv",
	DOAS: "Otomotiv",
	TCELL: "İletişim",
	TTKOM: "İletişim",
	ASELS: "Savunma",
	KOZAA: "Madencilik",
	KOZAL: "Madencilik",
	IHEVA: "Madencilik",
	SASA: "Kimya",
	BRISA: "Kimya",
	KONTR: "Kimya",
	HEKTS: "Kimya",
	AKSA: "Kimya",
	BIMAS: "Perakende",
	MGROS: "Perakende",
	SOKM: "Perakende",
	EKGYO: "GYO",
	GLYHO: "GYO",
	DAPGM: "GYO",
	PSGYO: "GYO",
	ISMEN: "İnşaat",
	ENKAI: "İnşaat",
	ALARK: "İnşaat",
	KONKA: "Tekstil",
	MAVI: "Tekstil",
	CANTE: "Tekstil",
	TGSAS: "Lojistik",
	AEFES: "İçecek",
	CCOLA: "İçecek",
	BTCIM: "İçecek",
	VESTL: "Teknoloji",
	EKOS: "Teknoloji",
	FONET: "Teknoloji",
	ANSGR: "Sigorta",
	TURSG: "Sigorta",
	FENER: "Spor",
	DSTKF: "Finans",
	EFOR: "Finans",
	OTKAR: "Otomotiv",
	OYAKC: "Enerji",
	GESAN: "Sanayi",
	GLRMK: "Kimya",
	GRSEL: "Sanayi",
	GRTHO: "Holding",
	IEYHO: "İçecek",
	IZENR: "Enerji",
	KLRHO: "Holding",
	KTLEV: "Teknoloji",
	KUYAS: "Enerji",
	MAGEN: "Madencilik",
	MIATK: "Enerji",
	MPARK: "Sağlık",
	OBAMS: "Holding",
	ODINE: "Teknoloji",
	PAHOL: "Holding",
	PASEU: "Holding",
	PATEK: "Sanayi",
	QUAGR: "Holding",
	RALYH: "Holding",
	REEDR: "Enerji",
	SMRTG: "Holding",
	TABGD: "Holding",
	TRENJ: "Enerji",
	TRMET: "Sanayi",
	ALTNY: "Holding",
	BALSU: "Holding",
	BERA: "Holding",
	BSOKE: "Sanayi",
	ESEN: "Holding",
	GENIL: "Holding"
};
async function fetchBatch(symbols, batchSize = 8) {
	const results = [];
	for (let i = 0; i < symbols.length; i += batchSize) {
		const batch = symbols.slice(i, i + batchSize);
		const batchResults = await Promise.allSettled(batch.map(async (sym) => {
			const meta = parseMeta(await yfFetch(`${sym}.IS`));
			if (!meta) return null;
			const changePercent = meta.prevClose ? (meta.price - meta.prevClose) / meta.prevClose * 100 : 0;
			return {
				symbol: sym,
				name: meta.name,
				price: meta.price,
				change: meta.change,
				changePercent,
				volume: meta.volume,
				high: meta.high,
				low: meta.low,
				high52: meta.high52,
				low52: meta.low52,
				sector: SECTOR_MAP[sym] || "Diğer"
			};
		}));
		results.push(...batchResults.filter((r) => r.status === "fulfilled").map((r) => r.value).filter(Boolean));
	}
	return results;
}
var fetchBistData_createServerFn_handler = createServerRpc({
	id: "02611667e118d7768acd40d062b055d1f63b1f4eecb4c1d65ad077422fa223b1",
	name: "fetchBistData",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchBistData.__executeServer(opts));
var fetchBistData = createServerFn({ method: "GET" }).validator(() => ({})).handler(fetchBistData_createServerFn_handler, async () => {
	return fetchBatch(BIST_SYMBOLS);
});
var fetchStockByQuery_createServerFn_handler = createServerRpc({
	id: "b0578e5ea9eef4e36911edd19d999d5ce815ce1ff3f23fd83ae39b54c3094725",
	name: "fetchStockByQuery",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchStockByQuery.__executeServer(opts));
var fetchStockByQuery = createServerFn({ method: "GET" }).validator((input) => {
	return { query: (input?.query || "").toUpperCase() };
}).handler(fetchStockByQuery_createServerFn_handler, async ({ data }) => {
	if (!data.query) return [];
	const matched = BIST_SYMBOLS.filter((s) => s.includes(data.query)).slice(0, 20);
	if (matched.length === 0) return [];
	return fetchBatch(matched);
});
var fetchSingleStock_createServerFn_handler = createServerRpc({
	id: "4c2a4de449674d71ab726fb8036579d21f79a1c7179875c98cd834cd8d231f5f",
	name: "fetchSingleStock",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchSingleStock.__executeServer(opts));
var fetchSingleStock = createServerFn({ method: "GET" }).validator((input) => {
	return { symbol: (input?.symbol || "THYAO").toUpperCase() };
}).handler(fetchSingleStock_createServerFn_handler, async ({ data }) => {
	return parseMeta(await yfFetch(`${data.symbol}.IS`));
});
var fetchStockHistory_createServerFn_handler = createServerRpc({
	id: "dd751f89693564f6afafd3fd4ccf2adadd782d82dfc0c7411e9aeaab94c51709",
	name: "fetchStockHistory",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchStockHistory.__executeServer(opts));
var fetchStockHistory = createServerFn({ method: "GET" }).validator((input) => {
	const obj = input;
	return {
		symbol: (obj?.symbol || "THYAO").toUpperCase(),
		range: obj?.range || "1mo"
	};
}).handler(fetchStockHistory_createServerFn_handler, async ({ data }) => {
	try {
		const result = await yfFetch(`${data.symbol}.IS`, data.range);
		if (!result?.timestamp || !result?.indicators?.quote?.[0]) return [];
		const quotes = result.indicators.quote[0];
		return result.timestamp.map((ts, i) => ({
			date: (/* @__PURE__ */ new Date(ts * 1e3)).toISOString(),
			open: quotes.open[i],
			high: quotes.high[i],
			low: quotes.low[i],
			close: quotes.close[i],
			volume: quotes.volume[i]
		}));
	} catch {
		return [];
	}
});
var fetchNews_createServerFn_handler = createServerRpc({
	id: "755d5e62c482d6cc8b24df5853d48c631a03ecbc391d3e0e67fb927c7cecd765",
	name: "fetchNews",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchNews.__executeServer(opts));
var fetchNews = createServerFn({ method: "GET" }).validator(() => ({})).handler(fetchNews_createServerFn_handler, async () => {
	try {
		const queries = [
			"borsa piyasa",
			"bist hisse",
			"türkiye ekonomi"
		];
		const allItems = [];
		for (const q of queries) try {
			const res = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotes_count=0&news_count=10&lang=tr-TR`, { headers: { "User-Agent": "Mozilla/5.0" } });
			if (res.ok) {
				const json = await res.json();
				if (json.news) allItems.push(...json.news);
			}
		} catch {}
		const seen = /* @__PURE__ */ new Set();
		const unique = allItems.filter((n) => {
			if (seen.has(n.title)) return false;
			seen.add(n.title);
			return true;
		});
		if (unique.length === 0) return getFallbackNews();
		return unique.slice(0, 30).map((n, i) => ({
			id: i + 1,
			title: n.title,
			source: n.publisher,
			time: timeAgo(n.providerPublishTime * 1e3),
			url: n.link,
			tag: guessTag(n.title),
			impact: guessImpact(n.title),
			thumbnail: n.thumbnail?.resolutions?.[0]?.url
		}));
	} catch {
		return getFallbackNews();
	}
});
function getFallbackNews() {
	return [{
		id: 1,
		title: "Piyasalar güncel verileri bekliyor",
		source: "stockbear",
		time: "şimdi",
		url: "#",
		tag: "Piyasa",
		impact: "medium"
	}, {
		id: 2,
		title: "BIST 100 endeksi işlem görüyor",
		source: "stockbear",
		time: "şimdi",
		url: "#",
		tag: "BIST",
		impact: "medium"
	}];
}
function timeAgo(dateMs) {
	const diff = Date.now() - dateMs;
	const mins = Math.floor(diff / 6e4);
	if (mins < 60) return `${mins} dk önce`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs} saat önce`;
	return `${Math.floor(hrs / 24)} gün önce`;
}
function guessTag(title) {
	const t = title.toLowerCase();
	if (t.includes("faiz") || t.includes("tcmb")) return "Ekonomi";
	if (t.includes("bist") || t.includes("endeks")) return "BIST";
	if (t.includes("dolar") || t.includes("euro") || t.includes("kur")) return "Döviz";
	if (t.includes("altın") || t.includes("emtia")) return "Emtia";
	if (t.includes("abd") || t.includes("fed")) return "Global";
	return "Piyasa";
}
function guessImpact(title) {
	const t = title.toLowerCase();
	if (t.includes("faiz") || t.includes("tcmb") || t.includes("enflasyon") || t.includes("tarım")) return "high";
	if (t.includes("bist") || t.includes("endeks") || t.includes("kar")) return "medium";
	return "low";
}
var fetchCalendar_createServerFn_handler = createServerRpc({
	id: "f81850fb6f5c19e5cd22f80e3b39179d64511896cbe7039bbc8ac03b8667d6bb",
	name: "fetchCalendar",
	filename: "src/lib/ai.functions.ts"
}, (opts) => fetchCalendar.__executeServer(opts));
var fetchCalendar = createServerFn({ method: "GET" }).validator(() => ({})).handler(fetchCalendar_createServerFn_handler, async () => {
	try {
		const res = await fetch("https://nfs.faireconomy.media/ff_calendar_thisweek.json", { headers: { "User-Agent": "Mozilla/5.0" } });
		if (!res.ok) return getFallbackCalendar();
		const items = await res.json();
		if (!items || items.length === 0) return getFallbackCalendar();
		return items.slice(0, 20).map((e) => ({
			date: formatDate(e.date),
			time: new Date(e.date).toLocaleTimeString("tr-TR", {
				hour: "2-digit",
				minute: "2-digit"
			}),
			event: e.title,
			country: countryFlag(e.country),
			impact: e.impact === "High" ? "high" : e.impact === "Medium" ? "medium" : "low",
			forecast: e.forecast || "-",
			previous: e.previous || "-"
		}));
	} catch {
		return getFallbackCalendar();
	}
});
function getFallbackCalendar() {
	const now = /* @__PURE__ */ new Date();
	return Array.from({ length: 5 }, (_, i) => {
		const d = new Date(now);
		d.setDate(d.getDate() + i);
		return {
			date: d.toLocaleDateString("tr-TR", {
				day: "2-digit",
				month: "short"
			}),
			time: "10:00",
			event: "Veri yükleniyor...",
			country: "🌍",
			impact: "medium",
			forecast: "-",
			previous: "-"
		};
	});
}
function formatDate(iso) {
	return new Date(iso).toLocaleDateString("tr-TR", {
		day: "2-digit",
		month: "short"
	});
}
function countryFlag(code) {
	return {
		US: "🇺🇸",
		TR: "🇹🇷",
		EU: "🇪🇺",
		GB: "🇬🇧",
		DE: "🇩🇪",
		JP: "🇯🇵",
		CN: "🇨🇳"
	}[code] || "🌍";
}
//#endregion
export { fetchBistData_createServerFn_handler, fetchCalendar_createServerFn_handler, fetchIndexes_createServerFn_handler, fetchNews_createServerFn_handler, fetchSingleStock_createServerFn_handler, fetchStockByQuery_createServerFn_handler, fetchStockHistory_createServerFn_handler };
