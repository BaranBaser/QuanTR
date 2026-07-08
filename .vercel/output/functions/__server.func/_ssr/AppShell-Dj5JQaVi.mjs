import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Bell, D as ChartColumn, E as ChartLine, I as ArrowRight, N as Beaker, O as CalendarDays, S as Funnel, b as Menu, c as Sun, d as Settings, f as Search, j as BellRing, k as Briefcase, l as Star, n as X, u as Sparkles, v as Newspaper, x as House, y as Moon } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-Dj5JQaVi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var stockbear_logo_default = "/assets/stockbear-logo-tednplyG.png";
var ai_chip_default = "/assets/ai-chip-DgOoXNRW.jpg";
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
	ALBRK: "Bankacılık",
	SAHOL: "Holding",
	KCHOL: "Holding",
	DOHOL: "Holding",
	EUREN: "Holding",
	BRYAT: "Holding",
	GSRAY: "Holding",
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
	EREGL: "Metal",
	KRDMD: "Metal",
	SISE: "Sanayi",
	ARCLK: "Sanayi",
	ECILC: "Sanayi",
	SAFKR: "Sanayi",
	BRSAN: "Sanayi",
	CIMSA: "Sanayi",
	CVKMD: "Sanayi",
	FROTO: "Otomotiv",
	TOASO: "Otomotiv",
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
	BALSU: "Holding",
	BERA: "Holding",
	BSOKE: "Sanayi",
	ESEN: "Holding",
	GENIL: "Holding",
	GESAN: "Sanayi",
	GLRMK: "Kimya",
	GRSEL: "Sanayi",
	GRTHO: "Holding",
	IEYHO: "İçecek",
	IZENR: "Enerji",
	KLRHO: "Holding",
	KTLEV: "Teknoloji",
	KUYAS: "Madencilik",
	MAGEN: "Madencilik",
	MIATK: "Enerji",
	MPARK: "Holding",
	OBAMS: "Holding",
	ODINE: "Teknoloji",
	OTKAR: "Otomotiv",
	OYAKC: "Enerji",
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
	ALTNY: "Holding"
};
function mkStock(s) {
	return {
		...s,
		changePercent: s.change,
		high: s.high ?? s.high52,
		low: s.low ?? s.low52
	};
}
var stocks = [
	mkStock({
		symbol: "AKBNK",
		name: "Akbank",
		sector: "Bankacılık",
		price: 71,
		change: -3.53,
		volume: 53e8,
		marketCap: 355e9,
		pe: 6.1,
		high52: 85,
		low52: 55
	}),
	mkStock({
		symbol: "GARAN",
		name: "Garanti Bankası",
		sector: "Bankacılık",
		price: 129.8,
		change: -3.42,
		volume: 19e8,
		marketCap: 533e9,
		pe: 4.8,
		high52: 150,
		low52: 95
	}),
	mkStock({
		symbol: "YKBNK",
		name: "Yapı Kredi Bankası",
		sector: "Bankacılık",
		price: 36.32,
		change: -3.4,
		volume: 44e8,
		marketCap: 181e9,
		pe: 3.5,
		high52: 42,
		low52: 25
	}),
	mkStock({
		symbol: "HALKB",
		name: "Halkbank",
		sector: "Bankacılık",
		price: 42.38,
		change: -2.44,
		volume: 988e6,
		marketCap: 134e9,
		pe: 2.9,
		high52: 52,
		low52: 32
	}),
	mkStock({
		symbol: "VAKBN",
		name: "Vakıfbank",
		sector: "Bankacılık",
		price: 31.2,
		change: -3.82,
		volume: 722e6,
		marketCap: 207e9,
		pe: 3.1,
		high52: 38,
		low52: 22
	}),
	mkStock({
		symbol: "ISCTR",
		name: "İş Bankası",
		sector: "Bankacılık",
		price: 13.89,
		change: -3.88,
		volume: 37e8,
		marketCap: 11e10,
		pe: 4.7,
		high52: 17,
		low52: 10
	}),
	mkStock({
		symbol: "TSKB",
		name: "Türk Ekonomi Bankası",
		sector: "Bankacılık",
		price: 11.56,
		change: -2.45,
		volume: 45e6,
		marketCap: 4e10,
		pe: 3.8,
		high52: 14,
		low52: 8
	}),
	mkStock({
		symbol: "SKBNK",
		name: "Şekerbank",
		sector: "Bankacılık",
		price: 18.95,
		change: -.79,
		volume: 218e6,
		marketCap: 28e9,
		pe: 2.5,
		high52: 24,
		low52: 14
	}),
	mkStock({
		symbol: "THYAO",
		name: "Türk Hava Yolları",
		sector: "Havacılık",
		price: 333.25,
		change: -4.31,
		volume: 19e9,
		marketCap: 462e9,
		pe: 3.7,
		high52: 380,
		low52: 220
	}),
	mkStock({
		symbol: "PGSUS",
		name: "Pegasus Havayolları",
		sector: "Havacılık",
		price: 167.1,
		change: -4.02,
		volume: 15e8,
		marketCap: 17e10,
		pe: 5.2,
		high52: 210,
		low52: 120
	}),
	mkStock({
		symbol: "TAVHL",
		name: "TAV Havalimanları",
		sector: "Havacılık",
		price: 261,
		change: -4.13,
		volume: 393e6,
		marketCap: 365e9,
		pe: 7.5,
		high52: 310,
		low52: 190
	}),
	mkStock({
		symbol: "TUPRS",
		name: "Tüpraş",
		sector: "Enerji",
		price: 260.75,
		change: 1.07,
		volume: 52e8,
		marketCap: 54e10,
		pe: 14.7,
		high52: 300,
		low52: 180
	}),
	mkStock({
		symbol: "PETKM",
		name: "Petkim",
		sector: "Enerji",
		price: 19.21,
		change: .26,
		volume: 1e9,
		marketCap: 54e9,
		pe: 8.9,
		high52: 24,
		low52: 14
	}),
	mkStock({
		symbol: "ODAS",
		name: "Odaş Elektrik",
		sector: "Enerji",
		price: 8.07,
		change: -1.82,
		volume: 248e6,
		marketCap: 13e9,
		pe: 5.1,
		high52: 12,
		low52: 6
	}),
	mkStock({
		symbol: "AKSEN",
		name: "Aksa Enerji",
		sector: "Enerji",
		price: 89.3,
		change: -.61,
		volume: 332e6,
		marketCap: 35e9,
		pe: 7.2,
		high52: 105,
		low52: 65
	}),
	mkStock({
		symbol: "ENJSA",
		name: "Enerjisa Enerji",
		sector: "Enerji",
		price: 103.3,
		change: -1.15,
		volume: 67e6,
		marketCap: 52e9,
		pe: 10.5,
		high52: 120,
		low52: 70
	}),
	mkStock({
		symbol: "ENERY",
		name: "Enerjisa Üretim",
		sector: "Enerji",
		price: 9.21,
		change: .22,
		volume: 186e6,
		marketCap: 92e8,
		pe: 4.8,
		high52: 12,
		low52: 6
	}),
	mkStock({
		symbol: "CWENE",
		name: "CW Enerji",
		sector: "Enerji",
		price: 40.16,
		change: -1.81,
		volume: 276e6,
		marketCap: 2e10,
		pe: 12.3,
		high52: 50,
		low52: 28
	}),
	mkStock({
		symbol: "EUPWR",
		name: "Europower Enerji",
		sector: "Enerji",
		price: 87.9,
		change: -.34,
		volume: 56e7,
		marketCap: 35e9,
		pe: 15.2,
		high52: 100,
		low52: 55
	}),
	mkStock({
		symbol: "ASTOR",
		name: "Astor Enerji",
		sector: "Enerji",
		price: 319.5,
		change: -1.77,
		volume: 57e8,
		marketCap: 42e9,
		pe: 22.5,
		high52: 420,
		low52: 180
	}),
	mkStock({
		symbol: "SAHOL",
		name: "Sabancı Holding",
		sector: "Holding",
		price: 89.75,
		change: -3.29,
		volume: 15e8,
		marketCap: 287e9,
		pe: 5.8,
		high52: 105,
		low52: 65
	}),
	mkStock({
		symbol: "KCHOL",
		name: "Koç Holding",
		sector: "Holding",
		price: 184.6,
		change: -2.43,
		volume: 17e8,
		marketCap: 52e10,
		pe: 20.3,
		high52: 220,
		low52: 150
	}),
	mkStock({
		symbol: "DOHOL",
		name: "Doğan Holding",
		sector: "Holding",
		price: 20.16,
		change: -2.14,
		volume: 103e6,
		marketCap: 12e9,
		pe: 6.5,
		high52: 26,
		low52: 14
	}),
	mkStock({
		symbol: "BRYAT",
		name: "Borusan Holding",
		sector: "Holding",
		price: 1837,
		change: -1.97,
		volume: 26e6,
		marketCap: 18e9,
		pe: 8.2,
		high52: 2200,
		low52: 1200
	}),
	mkStock({
		symbol: "EREGL",
		name: "Ereğli Demir Çelik",
		sector: "Metal",
		price: 39.48,
		change: -4.31,
		volume: 34e8,
		marketCap: 138e9,
		pe: 12.5,
		high52: 50,
		low52: 30
	}),
	mkStock({
		symbol: "KRDMD",
		name: "Kardemir",
		sector: "Metal",
		price: 35.8,
		change: -4.64,
		volume: 979e6,
		marketCap: 28e9,
		pe: 8.5,
		high52: 45,
		low52: 25
	}),
	mkStock({
		symbol: "SISE",
		name: "Şişecam",
		sector: "Sanayi",
		price: 41.82,
		change: -3.1,
		volume: 11e8,
		marketCap: 13e10,
		pe: 14.8,
		high52: 52,
		low52: 30
	}),
	mkStock({
		symbol: "ARCLK",
		name: "Arçelik",
		sector: "Sanayi",
		price: 97.2,
		change: -1.62,
		volume: 78e6,
		marketCap: 82e9,
		pe: 9.7,
		high52: 120,
		low52: 70
	}),
	mkStock({
		symbol: "ECILC",
		name: "Eczacıbaşı İlaç",
		sector: "Sanayi",
		price: 75,
		change: -1.57,
		volume: 105e6,
		marketCap: 25e9,
		pe: 15.6,
		high52: 90,
		low52: 55
	}),
	mkStock({
		symbol: "BRSAN",
		name: "Borusan Mannesmann",
		sector: "Sanayi",
		price: 536.5,
		change: -2.81,
		volume: 383e6,
		marketCap: 15e9,
		pe: 11.2,
		high52: 650,
		low52: 350
	}),
	mkStock({
		symbol: "CIMSA",
		name: "Çimsa Çimento",
		sector: "Sanayi",
		price: 47.18,
		change: -2.8,
		volume: 122e6,
		marketCap: 85e8,
		pe: 18.5,
		high52: 58,
		low52: 32
	}),
	mkStock({
		symbol: "FROTO",
		name: "Ford Otosan",
		sector: "Otomotiv",
		price: 81.35,
		change: -1.99,
		volume: 801e6,
		marketCap: 56e9,
		pe: 8.2,
		high52: 100,
		low52: 60
	}),
	mkStock({
		symbol: "TOASO",
		name: "Tofaş Otomobil",
		sector: "Otomotiv",
		price: 293.75,
		change: -1.76,
		volume: 487e6,
		marketCap: 44e9,
		pe: 12.5,
		high52: 350,
		low52: 220
	}),
	mkStock({
		symbol: "DOAS",
		name: "Doğuş Otomotiv",
		sector: "Otomotiv",
		price: 182.9,
		change: -.71,
		volume: 48e6,
		marketCap: 65e8,
		pe: 7.8,
		high52: 220,
		low52: 130
	}),
	mkStock({
		symbol: "ASELS",
		name: "Aselsan",
		sector: "Savunma",
		price: 388,
		change: 1.31,
		volume: 96e8,
		marketCap: 219e9,
		pe: 56.3,
		high52: 450,
		low52: 250
	}),
	mkStock({
		symbol: "TCELL",
		name: "Turkcell",
		sector: "İletişim",
		price: 104.1,
		change: -3.79,
		volume: 12e8,
		marketCap: 231e9,
		pe: 11.8,
		high52: 130,
		low52: 75
	}),
	mkStock({
		symbol: "TTKOM",
		name: "Türk Telekom",
		sector: "İletişim",
		price: 57.35,
		change: -3.29,
		volume: 857e6,
		marketCap: 124e9,
		pe: 8.5,
		high52: 72,
		low52: 42
	}),
	mkStock({
		symbol: "KOZAA",
		name: "Koza Altın",
		sector: "Madencilik",
		price: 42.15,
		change: 2.18,
		volume: 11e8,
		marketCap: 22e9,
		pe: 18.5,
		high52: 52,
		low52: 28
	}),
	mkStock({
		symbol: "SASA",
		name: "Sasa Polyester",
		sector: "Kimya",
		price: 2.27,
		change: -1.73,
		volume: 2e9,
		marketCap: 64e9,
		pe: 28.5,
		high52: 4.5,
		low52: 1.8
	}),
	mkStock({
		symbol: "HEKTS",
		name: "Hektaş",
		sector: "Kimya",
		price: 3.06,
		change: -1.92,
		volume: 384e6,
		marketCap: 1e10,
		pe: 22.8,
		high52: 4.2,
		low52: 2
	}),
	mkStock({
		symbol: "BIMAS",
		name: "BİM Mağazalar",
		sector: "Perakende",
		price: 371.5,
		change: -.73,
		volume: 19e8,
		marketCap: 228e9,
		pe: 20.2,
		high52: 420,
		low52: 280
	}),
	mkStock({
		symbol: "MGROS",
		name: "Migros",
		sector: "Perakende",
		price: 638,
		change: -1.62,
		volume: 635e6,
		marketCap: 64e9,
		pe: 15.2,
		high52: 750,
		low52: 420
	}),
	mkStock({
		symbol: "SOKM",
		name: "ŞOK Marketler",
		sector: "Perakende",
		price: 44.32,
		change: -2.12,
		volume: 83e6,
		marketCap: 15e9,
		pe: 12.8,
		high52: 55,
		low52: 32
	}),
	mkStock({
		symbol: "EKGYO",
		name: "Emlak Konut GYO",
		sector: "GYO",
		price: 20.36,
		change: -2.77,
		volume: 12e8,
		marketCap: 79e9,
		pe: 6.5,
		high52: 28,
		low52: 15
	}),
	mkStock({
		symbol: "ISMEN",
		name: "İş GMYO",
		sector: "İnşaat",
		price: 35.34,
		change: -1.61,
		volume: 71e6,
		marketCap: 7e9,
		pe: 6.8,
		high52: 42,
		low52: 25
	}),
	mkStock({
		symbol: "ENKAI",
		name: "Enka İnşaat",
		sector: "İnşaat",
		price: 89.35,
		change: -1.87,
		volume: 626e6,
		marketCap: 75e9,
		pe: 15,
		high52: 110,
		low52: 65
	}),
	mkStock({
		symbol: "AEFES",
		name: "Anadolu Efes",
		sector: "İçecek",
		price: 20.34,
		change: -.88,
		volume: 463e6,
		marketCap: 45e9,
		pe: 12.5,
		high52: 28,
		low52: 16
	}),
	mkStock({
		symbol: "VESTL",
		name: "Vestel Elektronik",
		sector: "Teknoloji",
		price: 23.92,
		change: -2.13,
		volume: 56e6,
		marketCap: 13e9,
		pe: 11.2,
		high52: 32,
		low52: 16
	}),
	mkStock({
		symbol: "TKFEN",
		name: "Tekfen Holding",
		sector: "İnşaat",
		price: 132.3,
		change: -.3,
		volume: 183e6,
		marketCap: 11e9,
		pe: 7.5,
		high52: 160,
		low52: 95
	}),
	mkStock({
		symbol: "OTKAR",
		name: "Otokar",
		sector: "Otomotiv",
		price: 354.75,
		change: -3.07,
		volume: 128e6,
		marketCap: 14e9,
		pe: 18.5,
		high52: 450,
		low52: 250
	}),
	mkStock({
		symbol: "OYAKC",
		name: "OYAK Çimento",
		sector: "Sanayi",
		price: 20.08,
		change: -3.09,
		volume: 116e6,
		marketCap: 12e9,
		pe: 9.2,
		high52: 26,
		low52: 15
	}),
	mkStock({
		symbol: "GLRMK",
		name: "Galata Kozmetik",
		sector: "Kimya",
		price: 161.2,
		change: -2.95,
		volume: 203e6,
		marketCap: 8e9,
		pe: 25,
		high52: 200,
		low52: 100
	}),
	mkStock({
		symbol: "GRTHO",
		name: "Gürtho Holding",
		sector: "Holding",
		price: 237.1,
		change: -1.82,
		volume: 26e6,
		marketCap: 5e9,
		pe: 15,
		high52: 300,
		low52: 160
	}),
	mkStock({
		symbol: "MAVI",
		name: "Mavi Giyim",
		sector: "Tekstil",
		price: 38.76,
		change: -2.86,
		volume: 95e6,
		marketCap: 6e9,
		pe: 14.5,
		high52: 50,
		low52: 28
	}),
	mkStock({
		symbol: "MPARK",
		name: "MLP Sağlık",
		sector: "Sağlık",
		price: 414.5,
		change: -2.41,
		volume: 74e6,
		marketCap: 12e9,
		pe: 35,
		high52: 520,
		low52: 280
	}),
	mkStock({
		symbol: "TTRAK",
		name: "Tümosan",
		sector: "Otomotiv",
		price: 437,
		change: .06,
		volume: 3e6,
		marketCap: 5e9,
		pe: 22,
		high52: 550,
		low52: 280
	}),
	mkStock({
		symbol: "ULKER",
		name: "Ülker Bisküvi",
		sector: "Gıda",
		price: 97.4,
		change: -2.21,
		volume: 186e6,
		marketCap: 18e9,
		pe: 12.5,
		high52: 120,
		low52: 70
	}),
	mkStock({
		symbol: "CCOLA",
		name: "Coca-Cola İçecek",
		sector: "İçecek",
		price: 83.25,
		change: -2.46,
		volume: 27e7,
		marketCap: 18e9,
		pe: 15.8,
		high52: 100,
		low52: 60
	}),
	mkStock({
		symbol: "TURSG",
		name: "Türkiye Sigorta",
		sector: "Sigorta",
		price: 6.09,
		change: 1.16,
		volume: 423e6,
		marketCap: 45e8,
		pe: 8.5,
		high52: 8,
		low52: 4
	}),
	mkStock({
		symbol: "GESAN",
		name: "Gediz Elektrik",
		sector: "Enerji",
		price: 80,
		change: -.56,
		volume: 135e6,
		marketCap: 8e9,
		pe: 12,
		high52: 100,
		low52: 55
	}),
	mkStock({
		symbol: "ANSGR",
		name: "Anadolu Anonim Sigorta",
		sector: "Sigorta",
		price: 27.04,
		change: -.22,
		volume: 27e6,
		marketCap: 5e9,
		pe: 6.5,
		high52: 35,
		low52: 18
	}),
	mkStock({
		symbol: "KUYAS",
		name: "Kuyaş Enerji",
		sector: "Enerji",
		price: 72.55,
		change: -4.29,
		volume: 269e6,
		marketCap: 4e9,
		pe: 10.5,
		high52: 95,
		low52: 45
	}),
	mkStock({
		symbol: "IZENR",
		name: "İzenerji",
		sector: "Enerji",
		price: 9.43,
		change: -2.38,
		volume: 9e8,
		marketCap: 3e9,
		pe: 8.2,
		high52: 13,
		low52: 6
	}),
	mkStock({
		symbol: "TRMET",
		name: "Tümosan Metal",
		sector: "Sanayi",
		price: 117.1,
		change: -3.22,
		volume: 304e6,
		marketCap: 5e9,
		pe: 14.5,
		high52: 150,
		low52: 80
	})
];
stocks.map((s) => s.symbol);
var findStock = (symbol) => stocks.find((s) => s.symbol === symbol.toUpperCase());
var nav = [
	{
		icon: House,
		label: "Ana Sayfa",
		to: "/"
	},
	{
		icon: ChartLine,
		label: "Piyasa Özeti",
		to: "/piyasa"
	},
	{
		icon: ChartColumn,
		label: "Hisse Analiz",
		to: "/analiz"
	},
	{
		icon: Sparkles,
		label: "Piyasa Analizi",
		to: "/ai"
	},
	{
		icon: Funnel,
		label: "Screener",
		to: "/screener"
	},
	{
		icon: Briefcase,
		label: "Portföyüm",
		to: "/portfoy"
	},
	{
		icon: Star,
		label: "Takip Listem",
		to: "/takip"
	},
	{
		icon: BellRing,
		label: "Alarmlar",
		to: "/alarm"
	},
	{
		icon: Beaker,
		label: "Simülasyon",
		to: "/simulasyon"
	},
	{
		icon: Newspaper,
		label: "Haberler",
		to: "/haberler"
	},
	{
		icon: CalendarDays,
		label: "Ekonomik Takvim",
		to: "/takvim"
	},
	{
		icon: Settings,
		label: "Ayarlar",
		to: "/ayarlar"
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [dark, setDark] = (0, import_react.useState)(true);
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if ((typeof window !== "undefined" ? localStorage.getItem("theme") : null) === "light") {
			document.documentElement.classList.remove("dark");
			setDark(false);
		}
	}, []);
	const toggleTheme = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	};
	const results = q.length > 0 ? stocks.filter((s) => s.symbol.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-4 px-4 md:px-6 py-3 border-b border-border sticky top-0 z-30 bg-background/95 backdrop-blur",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMobileMenuOpen(!mobileMenuOpen),
					className: "lg:hidden w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground",
					children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: stockbear_logo_default,
						alt: "stockbear",
						width: 40,
						height: 40,
						className: "w-10 h-10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xl font-bold hidden sm:inline",
						children: ["stock", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "bear"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 max-w-xl relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => {
								setQ(e.target.value);
								setOpen(true);
							},
							onFocus: () => setOpen(true),
							onBlur: () => setTimeout(() => setOpen(false), 150),
							placeholder: "Hisse ara...",
							className: "w-full bg-secondary/60 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/40"
						})]
					}), open && results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-full mt-2 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-40",
						children: results.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onMouseDown: () => {
								navigate({
									to: "/analiz",
									search: { symbol: s.symbol }
								});
								setQ("");
								setOpen(false);
							},
							className: "w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: s.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: s.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [s.price.toFixed(2), " TL"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-xs ${s.change >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`,
									children: [
										s.change >= 0 ? "+" : "",
										s.change.toFixed(2),
										"%"
									]
								})]
							})]
						}, s.symbol))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: toggleTheme,
						className: "w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground",
						children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "relative w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" })
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
					onClick: () => setMobileMenuOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "w-60 shrink-0 border-r border-border p-4 min-h-[calc(100vh-65px)] hidden lg:flex flex-col gap-1 sticky top-[65px] self-start max-h-[calc(100vh-65px)] overflow-y-auto",
					children: [nav.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-4 h-4" }), item.label]
						}, item.to);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Canlı Piyasa Verisi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Yahoo Finance ile BIST hisselerinin güncel fiyatlarını takip edin."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ai_chip_default,
								alt: "",
								width: 512,
								height: 256,
								loading: "lazy",
								className: "w-full h-20 object-cover rounded-lg my-3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ai",
								className: "w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg py-2 hover:bg-primary/90",
								children: ["Keşfet ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: `fixed top-[57px] left-0 w-64 h-[calc(100vh-57px)] bg-background border-r border-border p-4 flex flex-col gap-1 z-50 overflow-y-auto transition-transform duration-200 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`,
					children: nav.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setMobileMenuOpen(false),
							className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-4 h-4" }), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 min-w-0 p-4 md:p-6 space-y-6",
					children
				})
			]
		})]
	});
}
function seedRandom(seed) {
	return () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
}
function genLine(seed, points = 40, trend = "up") {
	const r = seedRandom(seed);
	const arr = [];
	let v = 50;
	for (let i = 0; i < points; i++) {
		const drift = trend === "up" ? .6 : trend === "down" ? -.6 : 0;
		v += (r() - .5) * 6 + drift;
		arr.push(v);
	}
	return arr;
}
function Sparkline({ data, color, height = 60, width = 200, fill = true }) {
	const min = Math.min(...data), range = Math.max(...data) - min || 1;
	const step = width / (data.length - 1);
	const path = `M ${data.map((v, i) => `${i * step},${height - (v - min) / range * height}`).join(" L ")}`;
	const area = `${path} L ${width},${height} L 0,${height} Z`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "100%",
		height,
		viewBox: `0 0 ${width} ${height}`,
		preserveAspectRatio: "none",
		children: [fill && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: area,
			fill: color,
			opacity: "0.15"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: path,
			stroke: color,
			strokeWidth: "1.6",
			fill: "none"
		})]
	});
}
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl md:text-3xl font-bold",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: subtitle
		})] }), action]
	});
}
//#endregion
export { findStock as a, stocks as c, Sparkline as i, PageHeader as n, genLine as o, SECTOR_MAP as r, stockbear_logo_default as s, AppShell as t };
