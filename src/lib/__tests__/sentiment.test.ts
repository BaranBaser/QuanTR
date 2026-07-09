import { describe, it, expect } from "vitest";
import {
  analyzeSentiment,
  getSentimentScore,
  analyzeNewsSentiment,
} from "../sentiment";

describe("analyzeSentiment", () => {
  it("pozitif metni tanır", () => {
    expect(analyzeSentiment("Hisse yükselişte, güçlü büyüme devam ediyor")).toBe("positive");
  });

  it("negatif metni tanır", () => {
    expect(analyzeSentiment("Düşüş devam ediyor, zarar açıklandı")).toBe("negative");
  });

  it("nötr metni tanır", () => {
    expect(analyzeSentiment("Bugün hava güzel")).toBe("neutral");
  });

  it("büyük/küçük harf duyarlı değil", () => {
    expect(analyzeSentiment("YÜKSELİŞ VE BÜYÜME")).toBe("positive");
    expect(analyzeSentiment("DÜŞÜŞ VE ZARAR")).toBe("negative");
  });

  it("boş string nötr döndürür", () => {
    expect(analyzeSentiment("")).toBe("neutral");
  });
});

describe("getSentimentScore", () => {
  it("pozitif skor döndürür", () => {
    expect(getSentimentScore("yükseliş büyüme kâr")).toBeGreaterThan(0);
  });

  it("negatif skor döndürür", () => {
    expect(getSentimentScore("düşüş zarar kayıp")).toBeLessThan(0);
  });

  it("nötr skor döndürür", () => {
    expect(getSentimentScore("")).toBe(0);
  });
});

describe("analyzeNewsSentiment", () => {
  it("pozitif haberleri doğru analiz eder", () => {
    const news = [
      { title: "Büyüme rekor kırdı" },
      { title: "Kâr beklentilerin üzerinde" },
      { title: "Yükseliş devam ediyor" },
    ];
    const result = analyzeNewsSentiment(news);
    expect(result.overall).toBe("positive");
    expect(result.positiveCount).toBe(3);
    expect(result.negativeCount).toBe(0);
  });

  it("negatif haberleri doğru analiz eder", () => {
    const news = [
      { title: "Zarar açıklandı" },
      { title: "Düşüş devam ediyor" },
      { title: "Kayıp büyük" },
    ];
    const result = analyzeNewsSentiment(news);
    expect(result.overall).toBe("negative");
    expect(result.negativeCount).toBe(3);
  });

  it("karışık haberleri nötr analiz eder", () => {
    const news = [
      { title: "Yükseliş var" },
      { title: "Düşüş var" },
      { title: "Bugün hava güzel" },
    ];
    const result = analyzeNewsSentiment(news);
    expect(result.overall).toBe("neutral");
  });

  it("boş dizi nötr döndürür", () => {
    const result = analyzeNewsSentiment([]);
    expect(result.overall).toBe("neutral");
    expect(result.score).toBe(0);
  });

  it("skoru -1 ile 1 arasında normalize eder", () => {
    const news = Array(10).fill({ title: "yükseliş büyüme" });
    const result = analyzeNewsSentiment(news);
    expect(result.score).toBeGreaterThanOrEqual(-1);
    expect(result.score).toBeLessThanOrEqual(1);
  });
});
