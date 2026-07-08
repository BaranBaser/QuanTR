import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { fetchSingleAiAnalysis, fetchTechnicalSignals } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { stocks } from "@/lib/market-data";
import { BIST_SYMBOLS, GLOBAL_SYMBOLS } from "@/lib/ai.functions";
import { AiAnalysisResult } from "@/components/AiAnalysisResult";

export const Route = createFileRoute("/ai")({ component: AIEnginePage });

function AIEnginePage() {
  const [selectedSymbol, setSelectedSymbol] = useState("THYAO");
  const [shareCount, setShareCount] = useState(100);
  const fetchAi = useServerFn(fetchSingleAiAnalysis);
  const fetchTopAi = useServerFn(fetchTechnicalSignals);

  const { data: topAiData, isLoading: topLoading } = useQuery({
    queryKey: ["ai-top-analysis"],
    queryFn: async () => {
      try { return await fetchTopAi(); } catch { return []; }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: aiData, isLoading } = useQuery({
    queryKey: ["ai-analysis-full", selectedSymbol],
    queryFn: async () => {
      try { return await fetchAi({ data: { symbol: selectedSymbol, dataCount: 252 } }); } catch { return null; }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Combine popular stocks with all available symbols so nothing is missing
  const allSymbols = Array.from(new Set([
    ...stocks.map(s => s.symbol),
    ...BIST_SYMBOLS,
    ...GLOBAL_SYMBOLS
  ])).sort();

  // Helper to get name
  const getSymbolName = (sym: string) => {
    const s = stocks.find(x => x.symbol === sym);
    return s ? `${sym} - ${s.name}` : sym;
  };

  return (
    <AppShell>
      <PageHeader
        title="AI Karar Motoru"
        subtitle="Seçtiğiniz fon/hisse için geçmiş testleri tamamlanmış dinamik ağırlıklı makine öğrenmesi tahminleri."
      />

      <div className="flex flex-col gap-6">
        
        {/* TOP AI TABLE */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> AI Sinyal Fırsat Tablosu
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Piyasadaki popüler hisselerin basit teknik indikatörler (RSI, Trend, Destek/Direnç) bazında günlük taraması. Yalnızca AL veya SAT konumunda olan fırsatlar listelenmektedir.</p>
          {topLoading ? (
             <div className="text-muted-foreground animate-pulse text-sm">Yapay zeka tüm piyasayı (100+ hisse) tarıyor... (5-10 saniye sürebilir)</div>
          ) : !topAiData || topAiData.length === 0 ? (
             <div className="text-muted-foreground text-sm">Şu an teknik olarak belirgin bir AL veya SAT sinyali üreten hisse bulunamadı.</div>
          ) : (
             <div className="overflow-x-auto max-h-[400px]">
               <table className="w-full text-left text-sm">
                 <thead className="sticky top-0 bg-card z-10 shadow-sm">
                   <tr className="border-b border-border text-muted-foreground">
                     <th className="pb-3 pr-4 font-semibold">Hisse</th>
                     <th className="pb-3 pr-4 font-semibold">Durum</th>
                     <th className="pb-3 pr-4 font-semibold">Teknik Puan</th>
                     <th className="pb-3 pr-4 font-semibold text-right">Fiyat</th>
                   </tr>
                 </thead>
                 <tbody>
                   {topAiData?.map((item: any) => (
                     <tr key={item.symbol} className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => setSelectedSymbol(item.symbol)}>
                       <td className="py-3 pr-4 font-bold">{item.symbol}</td>
                       <td className="py-3 pr-4 font-bold">
                         <span className={`px-2 py-1 rounded text-xs ${item.analysis.decision === 'AL' ? 'bg-[color:var(--success)]/10 text-[color:var(--success)]' : 'bg-destructive/10 text-destructive'}`}>
                           {item.analysis.decision}
                         </span>
                       </td>
                       <td className="py-3 pr-4">
                         {item.analysis.rawScore.toFixed(0)} Puan
                       </td>
                       <td className="py-3 pr-4 text-right">{item.analysis.currentPrice.toFixed(2)} ₺</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>

        {/* HİSSE SEÇİMİ VE ZAMAN DİLİMİ */}
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row gap-6 md:items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block text-muted-foreground">Analiz Edilecek Hisse / Fon Seçin:</label>
            <select 
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
            >
              {allSymbols.map(sym => (
                <option key={sym} value={sym}>{getSymbolName(sym)}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block text-muted-foreground flex justify-between items-center">
              <span>Portföydeki Hisse / Fon Adedi:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1"
                  className="w-24 bg-background border border-border rounded px-3 py-1 text-right font-bold focus:outline-none focus:border-primary/60 transition-colors"
                  value={shareCount}
                  onChange={(e) => setShareCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <span className="text-primary font-bold">Adet</span>
              </div>
            </label>
            <input 
              type="range" 
              min="1" 
              max="5000" 
              step="1" 
              value={shareCount} 
              onChange={(e) => setShareCount(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary mt-3"
            />
            <div className="text-xs text-muted-foreground mt-3">Tüm olası kâr/zarar ve projeksiyonlar elinizdeki bu adede göre hesaplanır.</div>
          </div>
        </div>

        {/* ANALİZ SONUÇLARI */}
        <AiAnalysisResult
          analysis={aiData?.analysis || null}
          shareCount={shareCount}
          isLoading={isLoading}
        />
      </div>
    </AppShell>
  );
}
