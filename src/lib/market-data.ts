// BIST hisseleri — Yahoo Finance ile gerçek zamanlı fiyat çekilir
export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number; // %
  changePercent: number; // alias
  volume: number; // TL
  marketCap: number;
  pe: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
};

export const SECTOR_MAP: Record<string, string> = {
  // Bankacılık (10)
  AKBNK: "Bankacılık", GARAN: "Bankacılık", YKBNK: "Bankacılık",
  HALKB: "Bankacılık", VAKBN: "Bankacılık", ISCTR: "Bankacılık",
  TSKB: "Bankacılık", QNBFB: "Bankacılık", SKBNK: "Bankacılık",
  ALBRK: "Bankacılık",
  // Holding (6)
  SAHOL: "Holding", KCHOL: "Holding", DOHOL: "Holding",
  EUREN: "Holding", BRYAT: "Holding", GSRAY: "Holding",
  // Enerji (9)
  TUPRS: "Enerji", PETKM: "Enerji", ODAS: "Enerji", AYDEM: "Enerji",
  AKSEN: "Enerji", ENJSA: "Enerji", ENERY: "Enerji",
  CWENE: "Enerji", EUPWR: "Enerji", ASTOR: "Enerji",
  // Metal (2)
  EREGL: "Metal", KRDMD: "Metal",
  // Sanayi (7)
  SISE: "Sanayi", ARCLK: "Sanayi", ECILC: "Sanayi", SAFKR: "Sanayi",
  BRSAN: "Sanayi", CIMSA: "Sanayi", CVKMD: "Sanayi",
  // Otomotiv (4)
  FROTO: "Otomotiv", TOASO: "Otomotiv", TTRAK: "Otomotiv", DOAS: "Otomotiv",
  // İletişim (2)
  TCELL: "İletişim", TTKOM: "İletişim",
  // Savunma (1)
  ASELS: "Savunma",
  // Madencilik (3)
  KOZAA: "Madencilik", KOZAL: "Madencilik", IHEVA: "Madencilik",
  // Kimya (5)
  SASA: "Kimya", BRISA: "Kimya", KONTR: "Kimya", HEKTS: "Kimya", AKSA: "Kimya",
  // Perakende (3)
  BIMAS: "Perakende", MGROS: "Perakende", SOKM: "Perakende",
  // GYO (4)
  EKGYO: "GYO", GLYHO: "GYO", DAPGM: "GYO", PSGYO: "GYO",
  // İnşaat (3)
  ISMEN: "İnşaat", ENKAI: "İnşaat", ALARK: "İnşaat",
  // Tekstil (3)
  KONKA: "Tekstil", MAVI: "Tekstil", CANTE: "Tekstil",
  // Lojistik (1)
  TGSAS: "Lojistik",
  // İçecek (3)
  AEFES: "İçecek", CCOLA: "İçecek", BTCIM: "İçecek",
  // Teknoloji (3)
  VESTL: "Teknoloji", EKOS: "Teknoloji", FONET: "Teknoloji",
  // Sigorta (2)
  ANSGR: "Sigorta", TURSG: "Sigorta",
  // Spor (1)
  FENER: "Spor",
  // Finans (2)
  DSTKF: "Finans", EFOR: "Finans",
  // Diğer (20+)
  BALSU: "Holding", BERA: "Holding", BSOKE: "Sanayi",
  ESEN: "Holding", GENIL: "Holding", GESAN: "Sanayi",
  GLRMK: "Kimya", GRSEL: "Sanayi", GRTHO: "Holding",
  IEYHO: "İçecek", IZENR: "Enerji", KLRHO: "Holding",
  KTLEV: "Teknoloji", KUYAS: "Madencilik", MAGEN: "Madencilik",
  MIATK: "Enerji", MPARK: "Holding", OBAMS: "Holding",
  ODINE: "Teknoloji", OTKAR: "Otomotiv", OYAKC: "Enerji",
  PAHOL: "Holding", PASEU: "Holding", PATEK: "Sanayi",
  QUAGR: "Holding", RALYH: "Holding", REEDR: "Enerji",
  SMRTG: "Holding", TABGD: "Holding", TRENJ: "Enerji",
  TRMET: "Sanayi", ALTNY: "Holding",
};

type StockInput = Omit<Stock, "changePercent" | "high" | "low"> & { high?: number; low?: number };

function mkStock(s: StockInput): Stock {
  return {
    ...s,
    changePercent: s.change,
    high: s.high ?? s.high52,
    low: s.low ?? s.low52,
  };
}

// Mock fallback — API çalışmazsa kullanılır
export const stocks: Stock[] = [
  mkStock({ symbol: "AKBNK", name: "Akbank", sector: "Bankacılık", price: 71.0, change: -3.53, volume: 5.3e9, marketCap: 355e9, pe: 6.1, high52: 85, low52: 55 }),
  mkStock({ symbol: "GARAN", name: "Garanti Bankası", sector: "Bankacılık", price: 129.8, change: -3.42, volume: 1.9e9, marketCap: 533e9, pe: 4.8, high52: 150, low52: 95 }),
  mkStock({ symbol: "YKBNK", name: "Yapı Kredi Bankası", sector: "Bankacılık", price: 36.32, change: -3.40, volume: 4.4e9, marketCap: 181e9, pe: 3.5, high52: 42, low52: 25 }),
  mkStock({ symbol: "HALKB", name: "Halkbank", sector: "Bankacılık", price: 42.38, change: -2.44, volume: 988e6, marketCap: 134e9, pe: 2.9, high52: 52, low52: 32 }),
  mkStock({ symbol: "VAKBN", name: "Vakıfbank", sector: "Bankacılık", price: 31.20, change: -3.82, volume: 722e6, marketCap: 207e9, pe: 3.1, high52: 38, low52: 22 }),
  mkStock({ symbol: "ISCTR", name: "İş Bankası", sector: "Bankacılık", price: 13.89, change: -3.88, volume: 3.7e9, marketCap: 110e9, pe: 4.7, high52: 17, low52: 10 }),
  mkStock({ symbol: "TSKB", name: "Türk Ekonomi Bankası", sector: "Bankacılık", price: 11.56, change: -2.45, volume: 45e6, marketCap: 40e9, pe: 3.8, high52: 14, low52: 8 }),
  mkStock({ symbol: "SKBNK", name: "Şekerbank", sector: "Bankacılık", price: 18.95, change: -0.79, volume: 218e6, marketCap: 28e9, pe: 2.5, high52: 24, low52: 14 }),
  mkStock({ symbol: "THYAO", name: "Türk Hava Yolları", sector: "Havacılık", price: 333.25, change: -4.31, volume: 19e9, marketCap: 462e9, pe: 3.7, high52: 380, low52: 220 }),
  mkStock({ symbol: "PGSUS", name: "Pegasus Havayolları", sector: "Havacılık", price: 167.10, change: -4.02, volume: 1.5e9, marketCap: 170e9, pe: 5.2, high52: 210, low52: 120 }),
  mkStock({ symbol: "TAVHL", name: "TAV Havalimanları", sector: "Havacılık", price: 261.0, change: -4.13, volume: 393e6, marketCap: 365e9, pe: 7.5, high52: 310, low52: 190 }),
  mkStock({ symbol: "TUPRS", name: "Tüpraş", sector: "Enerji", price: 260.75, change: 1.07, volume: 5.2e9, marketCap: 540e9, pe: 14.7, high52: 300, low52: 180 }),
  mkStock({ symbol: "PETKM", name: "Petkim", sector: "Enerji", price: 19.21, change: 0.26, volume: 1e9, marketCap: 54e9, pe: 8.9, high52: 24, low52: 14 }),
  mkStock({ symbol: "ODAS", name: "Odaş Elektrik", sector: "Enerji", price: 8.07, change: -1.82, volume: 248e6, marketCap: 13e9, pe: 5.1, high52: 12, low52: 6 }),
  mkStock({ symbol: "AKSEN", name: "Aksa Enerji", sector: "Enerji", price: 89.30, change: -0.61, volume: 332e6, marketCap: 35e9, pe: 7.2, high52: 105, low52: 65 }),
  mkStock({ symbol: "ENJSA", name: "Enerjisa Enerji", sector: "Enerji", price: 103.3, change: -1.15, volume: 67e6, marketCap: 52e9, pe: 10.5, high52: 120, low52: 70 }),
  mkStock({ symbol: "ENERY", name: "Enerjisa Üretim", sector: "Enerji", price: 9.21, change: 0.22, volume: 186e6, marketCap: 9.2e9, pe: 4.8, high52: 12, low52: 6 }),
  mkStock({ symbol: "CWENE", name: "CW Enerji", sector: "Enerji", price: 40.16, change: -1.81, volume: 276e6, marketCap: 20e9, pe: 12.3, high52: 50, low52: 28 }),
  mkStock({ symbol: "EUPWR", name: "Europower Enerji", sector: "Enerji", price: 87.90, change: -0.34, volume: 560e6, marketCap: 35e9, pe: 15.2, high52: 100, low52: 55 }),
  mkStock({ symbol: "ASTOR", name: "Astor Enerji", sector: "Enerji", price: 319.5, change: -1.77, volume: 5.7e9, marketCap: 42e9, pe: 22.5, high52: 420, low52: 180 }),
  mkStock({ symbol: "SAHOL", name: "Sabancı Holding", sector: "Holding", price: 89.75, change: -3.29, volume: 1.5e9, marketCap: 287e9, pe: 5.8, high52: 105, low52: 65 }),
  mkStock({ symbol: "KCHOL", name: "Koç Holding", sector: "Holding", price: 184.6, change: -2.43, volume: 1.7e9, marketCap: 520e9, pe: 20.3, high52: 220, low52: 150 }),
  mkStock({ symbol: "DOHOL", name: "Doğan Holding", sector: "Holding", price: 20.16, change: -2.14, volume: 103e6, marketCap: 12e9, pe: 6.5, high52: 26, low52: 14 }),
  mkStock({ symbol: "BRYAT", name: "Borusan Holding", sector: "Holding", price: 1837.0, change: -1.97, volume: 26e6, marketCap: 18e9, pe: 8.2, high52: 2200, low52: 1200 }),
  mkStock({ symbol: "EREGL", name: "Ereğli Demir Çelik", sector: "Metal", price: 39.48, change: -4.31, volume: 3.4e9, marketCap: 138e9, pe: 12.5, high52: 50, low52: 30 }),
  mkStock({ symbol: "KRDMD", name: "Kardemir", sector: "Metal", price: 35.80, change: -4.64, volume: 979e6, marketCap: 28e9, pe: 8.5, high52: 45, low52: 25 }),
  mkStock({ symbol: "SISE", name: "Şişecam", sector: "Sanayi", price: 41.82, change: -3.10, volume: 1.1e9, marketCap: 130e9, pe: 14.8, high52: 52, low52: 30 }),
  mkStock({ symbol: "ARCLK", name: "Arçelik", sector: "Sanayi", price: 97.20, change: -1.62, volume: 78e6, marketCap: 82e9, pe: 9.7, high52: 120, low52: 70 }),
  mkStock({ symbol: "ECILC", name: "Eczacıbaşı İlaç", sector: "Sanayi", price: 75.0, change: -1.57, volume: 105e6, marketCap: 25e9, pe: 15.6, high52: 90, low52: 55 }),
  mkStock({ symbol: "BRSAN", name: "Borusan Mannesmann", sector: "Sanayi", price: 536.5, change: -2.81, volume: 383e6, marketCap: 15e9, pe: 11.2, high52: 650, low52: 350 }),
  mkStock({ symbol: "CIMSA", name: "Çimsa Çimento", sector: "Sanayi", price: 47.18, change: -2.80, volume: 122e6, marketCap: 8.5e9, pe: 18.5, high52: 58, low52: 32 }),
  mkStock({ symbol: "FROTO", name: "Ford Otosan", sector: "Otomotiv", price: 81.35, change: -1.99, volume: 801e6, marketCap: 56e9, pe: 8.2, high52: 100, low52: 60 }),
  mkStock({ symbol: "TOASO", name: "Tofaş Otomobil", sector: "Otomotiv", price: 293.75, change: -1.76, volume: 487e6, marketCap: 44e9, pe: 12.5, high52: 350, low52: 220 }),
  mkStock({ symbol: "DOAS", name: "Doğuş Otomotiv", sector: "Otomotiv", price: 182.9, change: -0.71, volume: 48e6, marketCap: 6.5e9, pe: 7.8, high52: 220, low52: 130 }),
  mkStock({ symbol: "ASELS", name: "Aselsan", sector: "Savunma", price: 388.0, change: 1.31, volume: 9.6e9, marketCap: 219e9, pe: 56.3, high52: 450, low52: 250 }),
  mkStock({ symbol: "TCELL", name: "Turkcell", sector: "İletişim", price: 104.1, change: -3.79, volume: 1.2e9, marketCap: 231e9, pe: 11.8, high52: 130, low52: 75 }),
  mkStock({ symbol: "TTKOM", name: "Türk Telekom", sector: "İletişim", price: 57.35, change: -3.29, volume: 857e6, marketCap: 124e9, pe: 8.5, high52: 72, low52: 42 }),
  mkStock({ symbol: "KOZAA", name: "Koza Altın", sector: "Madencilik", price: 42.15, change: 2.18, volume: 1.1e9, marketCap: 22e9, pe: 18.5, high52: 52, low52: 28 }),
  mkStock({ symbol: "SASA", name: "Sasa Polyester", sector: "Kimya", price: 2.27, change: -1.73, volume: 2e9, marketCap: 64e9, pe: 28.5, high52: 4.5, low52: 1.8 }),
  mkStock({ symbol: "HEKTS", name: "Hektaş", sector: "Kimya", price: 3.06, change: -1.92, volume: 384e6, marketCap: 10e9, pe: 22.8, high52: 4.2, low52: 2.0 }),
  mkStock({ symbol: "BIMAS", name: "BİM Mağazalar", sector: "Perakende", price: 371.5, change: -0.73, volume: 1.9e9, marketCap: 228e9, pe: 20.2, high52: 420, low52: 280 }),
  mkStock({ symbol: "MGROS", name: "Migros", sector: "Perakende", price: 638.0, change: -1.62, volume: 635e6, marketCap: 64e9, pe: 15.2, high52: 750, low52: 420 }),
  mkStock({ symbol: "SOKM", name: "ŞOK Marketler", sector: "Perakende", price: 44.32, change: -2.12, volume: 83e6, marketCap: 15e9, pe: 12.8, high52: 55, low52: 32 }),
  mkStock({ symbol: "EKGYO", name: "Emlak Konut GYO", sector: "GYO", price: 20.36, change: -2.77, volume: 1.2e9, marketCap: 79e9, pe: 6.5, high52: 28, low52: 15 }),
  mkStock({ symbol: "ISMEN", name: "İş GMYO", sector: "İnşaat", price: 35.34, change: -1.61, volume: 71e6, marketCap: 7e9, pe: 6.8, high52: 42, low52: 25 }),
  mkStock({ symbol: "ENKAI", name: "Enka İnşaat", sector: "İnşaat", price: 89.35, change: -1.87, volume: 626e6, marketCap: 75e9, pe: 15.0, high52: 110, low52: 65 }),
  mkStock({ symbol: "AEFES", name: "Anadolu Efes", sector: "İçecek", price: 20.34, change: -0.88, volume: 463e6, marketCap: 45e9, pe: 12.5, high52: 28, low52: 16 }),
  mkStock({ symbol: "VESTL", name: "Vestel Elektronik", sector: "Teknoloji", price: 23.92, change: -2.13, volume: 56e6, marketCap: 13e9, pe: 11.2, high52: 32, low52: 16 }),
  mkStock({ symbol: "TKFEN", name: "Tekfen Holding", sector: "İnşaat", price: 132.3, change: -0.30, volume: 183e6, marketCap: 11e9, pe: 7.5, high52: 160, low52: 95 }),
  mkStock({ symbol: "OTKAR", name: "Otokar", sector: "Otomotiv", price: 354.75, change: -3.07, volume: 128e6, marketCap: 14e9, pe: 18.5, high52: 450, low52: 250 }),
  mkStock({ symbol: "OYAKC", name: "OYAK Çimento", sector: "Sanayi", price: 20.08, change: -3.09, volume: 116e6, marketCap: 12e9, pe: 9.2, high52: 26, low52: 15 }),
  mkStock({ symbol: "GLRMK", name: "Galata Kozmetik", sector: "Kimya", price: 161.2, change: -2.95, volume: 203e6, marketCap: 8e9, pe: 25.0, high52: 200, low52: 100 }),
  mkStock({ symbol: "GRTHO", name: "Gürtho Holding", sector: "Holding", price: 237.1, change: -1.82, volume: 26e6, marketCap: 5e9, pe: 15.0, high52: 300, low52: 160 }),
  mkStock({ symbol: "MAVI", name: "Mavi Giyim", sector: "Tekstil", price: 38.76, change: -2.86, volume: 95e6, marketCap: 6e9, pe: 14.5, high52: 50, low52: 28 }),
  mkStock({ symbol: "MPARK", name: "MLP Sağlık", sector: "Sağlık", price: 414.5, change: -2.41, volume: 74e6, marketCap: 12e9, pe: 35.0, high52: 520, low52: 280 }),
  mkStock({ symbol: "TTRAK", name: "Tümosan", sector: "Otomotiv", price: 437.0, change: 0.06, volume: 3e6, marketCap: 5e9, pe: 22.0, high52: 550, low52: 280 }),
  mkStock({ symbol: "ULKER", name: "Ülker Bisküvi", sector: "Gıda", price: 97.40, change: -2.21, volume: 186e6, marketCap: 18e9, pe: 12.5, high52: 120, low52: 70 }),
  mkStock({ symbol: "CCOLA", name: "Coca-Cola İçecek", sector: "İçecek", price: 83.25, change: -2.46, volume: 270e6, marketCap: 18e9, pe: 15.8, high52: 100, low52: 60 }),
  mkStock({ symbol: "TURSG", name: "Türkiye Sigorta", sector: "Sigorta", price: 6.09, change: 1.16, volume: 423e6, marketCap: 4.5e9, pe: 8.5, high52: 8, low52: 4 }),
  mkStock({ symbol: "GESAN", name: "Gediz Elektrik", sector: "Enerji", price: 80.0, change: -0.56, volume: 135e6, marketCap: 8e9, pe: 12.0, high52: 100, low52: 55 }),
  mkStock({ symbol: "ANSGR", name: "Anadolu Anonim Sigorta", sector: "Sigorta", price: 27.04, change: -0.22, volume: 27e6, marketCap: 5e9, pe: 6.5, high52: 35, low52: 18 }),
  mkStock({ symbol: "KUYAS", name: "Kuyaş Enerji", sector: "Enerji", price: 72.55, change: -4.29, volume: 269e6, marketCap: 4e9, pe: 10.5, high52: 95, low52: 45 }),
  mkStock({ symbol: "IZENR", name: "İzenerji", sector: "Enerji", price: 9.43, change: -2.38, volume: 900e6, marketCap: 3e9, pe: 8.2, high52: 13, low52: 6 }),
  mkStock({ symbol: "TRMET", name: "Tümosan Metal", sector: "Sanayi", price: 117.1, change: -3.22, volume: 304e6, marketCap: 5e9, pe: 14.5, high52: 150, low52: 80 }),
];

export const findStock = (symbol: string) => stocks.find((s) => s.symbol === symbol.toUpperCase());
