import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { fetchSingleAiAnalysis, fetchTopAiAnalysis } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Brain, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Target, Zap, LineChart as LineChartIcon } from "lucide-react";
import { stocks } from "@/lib/market-data";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/ai")({ component: AIEnginePage });

function AIEnginePage() {
  const [selectedSymbol, setSelectedSymbol] = useState("THYAO");
  const [dataCount, setDataCount] = useState(252);
  const fetchAi = useServerFn(fetchSingleAiAnalysis);
  const fetchTopAi = useServerFn(fetchTopAiAnalysis);

  const { data: topAiData, isLoading: topLoading } = useQuery({
    queryKey: ["ai-top-analysis"],
    queryFn: async () => {
      try { return await fetchTopAi(); } catch { return []; }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: aiData, isLoading } = useQuery({
    queryKey: ["ai-analysis-full", selectedSymbol, dataCount],
    queryFn: async () => {
      try { return await fetchAi({ data: { symbol: selectedSymbol, dataCount } }); } catch { return null; }
    },
    staleTime: 5 * 60 * 1000,
  });

  const popularStocks = [...stocks].sort((a, b) => b.volume - a.volume);

  const mapHorizonToLabel = (days: number) => {
    switch(days) {
      case 1: return "1 Gün";
      case 5: return "1 Hafta";
      case 20: return "1 Ay";
      case 60: return "3 Ay";
      case 120: return "6 Ay";
      default: return `${days} Gün`;
    }
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
          {topLoading ? (
             <div className="text-muted-foreground animate-pulse text-sm">Yapay zeka piyasayı tarıyor... (İlk açılışta 10-15 saniye sürebilir)</div>
          ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="border-b border-border text-muted-foreground">
                     <th className="pb-3 pr-4 font-semibold">Hisse</th>
                     <th className="pb-3 pr-4 font-semibold">AI Kararı</th>
                     <th className="pb-3 pr-4 font-semibold">Güven Skoru</th>
                     <th className="pb-3 pr-4 font-semibold text-right">Fiyat</th>
                   </tr>
                 </thead>
                 <tbody>
                   {topAiData?.map((item: any) => (
                     <tr key={item.symbol} className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => setSelectedSymbol(item.symbol)}>
                       <td className="py-3 pr-4 font-bold">{item.symbol}</td>
                       <td className="py-3 pr-4 font-bold">
                         <span className={`px-2 py-1 rounded text-xs ${item.analysis.decision === 'AL' ? 'bg-[color:var(--success)]/10 text-[color:var(--success)]' : item.analysis.decision === 'SAT' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-500/10 text-yellow-500'}`}>
                           {item.analysis.decision}
                         </span>
                       </td>
                       <td className="py-3 pr-4">%{item.analysis.confidenceScore.toFixed(0)}</td>
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
              {popularStocks.map(s => (
                <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block text-muted-foreground flex justify-between">
              <span>Tarihsel Veri Limiti (Adet/Gün):</span>
              <span className="text-primary">{dataCount} Gün</span>
            </label>
            <input 
              type="range" 
              min="30" 
              max="1000" 
              step="10" 
              value={dataCount} 
              onChange={(e) => setDataCount(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-xs text-muted-foreground mt-2">Alttaki süreç hesapları ve model eğitimleri bu süreye göre yapılır.</div>
          </div>
        </div>

        {/* ANALİZ SONUÇLARI */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground animate-pulse border border-border bg-card rounded-xl">
            <Brain className="w-12 h-12 mb-4 opacity-50" />
            <div className="text-lg">Tüm zaman dilimleri için makine öğrenmesi modelleri test ediliyor...</div>
          </div>
        ) : !aiData?.analysis ? (
          <div className="py-20 text-center text-muted-foreground border border-border bg-card rounded-xl">
            Yeterli geçmiş veri bulunamadı. Algoritmaların çalışması için en az 1 yıllık fiyat geçmişi gereklidir.
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* ANA KARAR */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`rounded-xl p-6 flex flex-col items-center justify-center text-center border shadow-lg ${
                aiData.analysis.decision === "AL" ? "bg-[color:var(--success)]/10 border-[color:var(--success)]/30 text-[color:var(--success)] shadow-[color:var(--success)]/10" :
                aiData.analysis.decision === "SAT" ? "bg-destructive/10 border-destructive/30 text-destructive shadow-destructive/10" :
                "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-yellow-500/10"
              }`}>
                <div className="text-sm font-bold tracking-widest uppercase mb-2 opacity-80">Genel Motor Kararı</div>
                <div className="text-5xl font-black flex items-center gap-3">
                  {aiData.analysis.decision === "AL" ? <CheckCircle2 className="w-10 h-10" /> : 
                   aiData.analysis.decision === "SAT" ? <AlertTriangle className="w-10 h-10" /> : 
                   <AlertCircle className="w-10 h-10" />}
                  {aiData.analysis.decision}
                </div>
              </div>

              <div className="rounded-xl p-6 border border-border bg-card flex flex-col items-center justify-center text-center shadow-md">
                <div className="text-sm font-bold tracking-widest uppercase mb-3 text-muted-foreground">Ortak Güven Skoru</div>
                <div className="w-full bg-secondary h-4 rounded-full max-w-[200px] overflow-hidden mb-3 relative">
                  <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000" style={{ width: `${aiData.analysis.confidenceScore}%` }} />
                </div>
                <div className="text-3xl font-black">%{aiData.analysis.confidenceScore.toFixed(1)}</div>
              </div>

              <div className="rounded-xl p-6 border border-border bg-card flex flex-col items-center justify-center text-center shadow-md">
                <div className="text-sm font-bold tracking-widest uppercase mb-2 text-muted-foreground">Şu Anki Fiyat</div>
                <div className="text-4xl font-black">{aiData.analysis.currentPrice.toFixed(2)} TL</div>
                <div className="text-sm text-muted-foreground mt-2">Volatilite: %{aiData.analysis.volatility.toFixed(2)}</div>
              </div>
            </div>

            {/* DETAYLI SÜRE BAZLI TAHMİNLER (Backtest + Ensemble) */}
            <h2 className="text-xl font-bold mt-8 mb-4 border-b border-border pb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Zaman Dilimlerine Göre Makine Öğrenmesi Raporları
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {aiData.analysis.predictions.filter((p: any) => [5, 20, 60, 120].includes(p.horizonDays)).map((p: any) => (
                <div key={p.horizonDays} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                  {/* Başlık ve Nihai Karar */}
                  <div className="p-4 bg-secondary/30 border-b border-border flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" /> {mapHorizonToLabel(p.horizonDays)} Gelecek Projeksiyonu
                    </h3>
                    <div className="text-right">
                      <div className={`text-lg font-black ${p.expectedReturnPercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
                        {p.expectedPrice.toFixed(2)} TL ({p.expectedReturnPercent >= 0 ? "+" : ""}{p.expectedReturnPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Alt Modellerin Puanlamaları */}
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase mb-3">Model Hata Payları & Ağırlıklar (Geçmiş Test)</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {p.models.map((m: any) => (
                          <div key={m.model} className="bg-secondary/40 rounded-lg p-3 text-center border border-border/50">
                            <div className="text-[10px] font-bold text-muted-foreground truncate mb-1">{m.model.replace("_", " ")}</div>
                            <div className="text-sm font-semibold">{m.prediction.toFixed(2)}</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px]">
                              <span className="text-destructive font-medium">Hata: %{m.rmse.toFixed(1)}</span>
                              <span className="text-primary font-bold">Ağ: %{(m.weight * 100).toFixed(0)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ensemble Detayları */}
                    <div className="bg-background rounded-lg p-4 text-sm border border-border flex justify-between items-center">
                      <div>
                        <div className="text-muted-foreground text-xs mb-1">Nihai Ortak Güven (Yanılma Payı)</div>
                        <div className="font-semibold text-destructive">± %{p.rmse.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs mb-1">Hesaplanan Güvenlik Bandı</div>
                        <div className="font-semibold">{p.lowerBand.toFixed(2)} - {p.upperBand.toFixed(2)} TL</div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* BÜYÜK GRAFİK */}
            <div className="border border-border rounded-xl bg-card p-6 shadow-sm mt-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-primary" /> Modellerin Zaman Çizelgesindeki Beklentileri
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    { name: "Şu An", Ensemble: aiData.analysis.currentPrice, AltBant: aiData.analysis.currentPrice, ÜstBant: aiData.analysis.currentPrice, LinearRegression: aiData.analysis.currentPrice, MomentumExtrapolation: aiData.analysis.currentPrice, MeanReversion: aiData.analysis.currentPrice, EMA_Projection: aiData.analysis.currentPrice },
                    ...aiData.analysis.predictions.map((p: any) => {
                      const obj: any = {
                        name: mapHorizonToLabel(p.horizonDays),
                        Ensemble: p.expectedPrice,
                        AltBant: p.lowerBand,
                        ÜstBant: p.upperBand,
                      };
                      p.models.forEach((m: any) => { obj[m.model] = m.prediction; });
                      return obj;
                    })
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} width={40} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    
                    <Area type="monotone" dataKey="ÜstBant" fill="currentColor" fillOpacity={0.03} stroke="none" />
                    <Area type="monotone" dataKey="AltBant" fill="var(--background)" fillOpacity={1} stroke="none" />
                    
                    <Line type="monotone" dataKey="LinearRegression" stroke="oklch(0.6 0.15 200)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Lineer Regresyon" />
                    <Line type="monotone" dataKey="MomentumExtrapolation" stroke="oklch(0.6 0.15 40)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Momentum" />
                    <Line type="monotone" dataKey="MeanReversion" stroke="oklch(0.6 0.15 300)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Mean Reversion" />
                    <Line type="monotone" dataKey="EMA_Projection" stroke="oklch(0.6 0.15 100)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="EMA Projeksiyonu" />
                    
                    <Line type="monotone" dataKey="Ensemble" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: "var(--primary)" }} activeDot={{ r: 8 }} name="Nihai Ortak Beklenti" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </AppShell>
  );
}
