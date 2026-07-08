import { useQuery } from "@tanstack/react-query";
import { fetchTopAiAnalysis } from "@/lib/ai.functions";
import { RefreshCw, Activity, Brain, Target, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AiAnalysisTable() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["ai-top-analysis"],
    queryFn: async () => {
      try {
        return await fetchTopAiAnalysis({});
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Yapay Zeka Karar Motoru</h3>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Güncelleniyor..." : "Yenile"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
        <Info className="w-4 h-4" />
        Makine öğrenmesi modelleri (Lineer Regresyon, Momentum, Mean Reversion) kullanılarak üretilen tamamen yerel analizler.
      </p>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground animate-pulse">
          Modeller hesaplanıyor...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left font-medium pb-2">Hisse</th>
                <th className="text-center font-medium pb-2">Karar</th>
                <th className="text-center font-medium pb-2">Güven Skoru</th>
                <th className="text-right font-medium pb-2">Trend</th>
                <th className="text-right font-medium pb-2">20G Beklenti</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.symbol} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3">
                      <Link to="/analiz" search={{ symbol: row.symbol }} className="font-bold hover:text-primary transition-colors">
                        {row.symbol}
                      </Link>
                    </td>
                    <td className="text-center py-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        row.analysis.decision === "AL" ? "bg-[color:var(--success)]/20 text-[color:var(--success)]" :
                        row.analysis.decision === "SAT" ? "bg-destructive/20 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {row.analysis.decision}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <div className="w-full bg-secondary h-1.5 rounded-full mt-1.5 max-w-[80px] mx-auto overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${row.analysis.confidenceScore}%`,
                            backgroundColor: row.analysis.confidenceScore > 70 ? 'var(--success)' : row.analysis.confidenceScore > 40 ? 'var(--primary)' : 'var(--destructive)'
                          }} 
                        />
                      </div>
                      <div className="text-[10px] mt-1 text-muted-foreground font-medium">%{row.analysis.confidenceScore.toFixed(0)}</div>
                    </td>
                    <td className="text-right py-3 text-xs">
                      {row.analysis.trend === "YÜKSELEN" ? (
                        <span className="text-[color:var(--success)] font-medium">Yükselen</span>
                      ) : row.analysis.trend === "DÜŞEN" ? (
                        <span className="text-destructive font-medium">Düşen</span>
                      ) : (
                        <span className="text-muted-foreground font-medium">Yatay</span>
                      )}
                    </td>
                    <td className="text-right py-3">
                      {(() => {
                        const pred20 = row.analysis.predictions.find((p: any) => p.horizonDays === 20);
                        if (!pred20) return "-";
                        return (
                          <div className={`text-xs font-bold ${pred20.expectedReturnPercent >= 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
                            {pred20.expectedReturnPercent >= 0 ? "+" : ""}{pred20.expectedReturnPercent.toFixed(2)}%
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-muted-foreground text-xs">
                    Analiz üretilemedi veya veri yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
