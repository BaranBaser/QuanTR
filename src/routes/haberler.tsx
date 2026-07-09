import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useServerFn } from "@tanstack/react-start";
import { fetchNews } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, ExternalLink, RefreshCw, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { stocks } from "@/lib/market-data";
import { analyzeNewsSentiment, analyzeSentiment, type SentimentResult } from "@/lib/sentiment";

export const Route = createFileRoute("/haberler")({
  head: () => ({
    meta: [
      { title: "Haberler — stockbear" },
      { name: "description", content: "Güncel finans haberlerini okuyun, duygu analizini görüntüleyin." },
      { property: "og:title", content: "Haberler — stockbear" },
    ],
  }),
  component: NewsPage,
});

const tags = ["Tümü", "Ekonomi", "BIST", "Döviz", "Emtia", "Global", "Piyasa"];

function NewsPage() {
  const [tag, setTag] = useState("Tümü");
  const [sourceFilter, setSourceFilter] = useState("Tümü");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  
  const fetchNewsFn = useServerFn(fetchNews);

  const { data: allNews = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["news", selectedSymbol],
    queryFn: async () => {
      // Varsayılan olarak en popüler (THYAO) veya seçili hisseyi getirir
      try { return await fetchNewsFn({ data: { symbol: selectedSymbol || "THYAO" } }); } catch { return []; }
    },
    staleTime: 300_000,
    throwOnError: false,
  });

  const sources = ["Tümü", ...Array.from(new Set(allNews.map((n) => n.source)))];
  
  const newsWithSentiment = useMemo(() => {
    return allNews.map(n => ({
      ...n,
      sentiment: analyzeSentiment(n.title),
    }));
  }, [allNews]);

  const sentiment = useMemo(() => analyzeNewsSentiment(allNews), [allNews]);

  const sentimentFilters = ["all", "positive", "negative", "neutral"] as const;
  
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return stocks.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 10);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let result = newsWithSentiment.filter((n) => {
      if (tag !== "Tümü" && n.tag !== tag) return false;
      if (sourceFilter !== "Tümü" && n.source !== sourceFilter) return false;
      if (sentimentFilter !== "all" && n.sentiment !== sentimentFilter) return false;
      return true;
    });
    // Resimli haberleri ve popüler olanları önceliklendir (Thumbnail olanlar üste)
    result.sort((a, b) => (b.thumbnail ? 1 : 0) - (a.thumbnail ? 1 : 0));
    return result;
  }, [newsWithSentiment, tag, sourceFilter, sentimentFilter]);

  return (
    <AppShell>
      <PageHeader
        title="Haberler"
        subtitle={selectedSymbol ? `${selectedSymbol} - İlgili Haberler` : "Piyasadan ve popüler hisselerden en güncel haberler."}
        action={
          <button onClick={() => refetch()} disabled={isFetching} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Yenile
          </button>
        }
      />

      {/* Hisse Arama */}
      <div className="relative w-full max-w-md mb-6 z-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Hisse bazlı haber ara (Bulanık Arama)..."
          value={searchQuery}
          onFocus={() => setShowSearch(true)}
          onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary/60"
        />
        {selectedSymbol && (
          <button onClick={() => { setSelectedSymbol(null); setSearchQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
            {searchResults.map((res) => (
              <div
                key={res.symbol}
                className="flex flex-col px-4 py-2 hover:bg-secondary cursor-pointer border-b border-border last:border-0"
                onClick={() => { setSelectedSymbol(res.symbol); setSearchQuery(res.symbol); setShowSearch(false); }}
              >
                <span className="font-semibold text-sm">{res.symbol}</span>
                <span className="text-xs text-muted-foreground truncate">{res.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={`px-3 py-1.5 rounded-lg text-sm border ${tag === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:border-primary/40"}`}>{t}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.slice(0, 8).map((s) => (
          <button key={s} onClick={() => setSourceFilter(s)} className={`px-2 py-1 rounded text-xs border ${sourceFilter === s ? "bg-secondary text-foreground border-primary/40" : "bg-muted/50 border-border text-muted-foreground hover:border-primary/40"}`}>{s}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {sentimentFilters.map((sf) => (
          <button key={sf} onClick={() => setSentimentFilter(sf)} className={`px-2 py-1 rounded text-xs border ${sentimentFilter === sf ? "bg-secondary text-foreground border-primary/40" : "bg-muted/50 border-border text-muted-foreground hover:border-primary/40"}`}>
            {sf === "all" ? "Tüm Duygular" : sf === "positive" ? "🟢 Pozitif" : sf === "negative" ? "🔴 Negatif" : "⚪ Nötr"}
          </button>
        ))}
      </div>

      {allNews.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3 flex flex-wrap items-center gap-3 text-sm">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
            sentiment.overall === "positive" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" :
            sentiment.overall === "negative" ? "bg-destructive/15 text-destructive" :
            "bg-muted text-muted-foreground"
          }`}>
            {sentiment.overall === "positive" ? "🟢" : sentiment.overall === "negative" ? "🔴" : "⚪"}
            {sentiment.overall === "positive" ? "Pozitif" : sentiment.overall === "negative" ? "Negatif" : "Nötr"}
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted/50 min-w-[100px]">
            <div className="flex h-full">
              <div className="h-full bg-[color:var(--success)]" style={{ width: `${allNews.length > 0 ? (sentiment.positiveCount / allNews.length) * 100 : 0}%` }} />
              <div className="h-full bg-destructive" style={{ width: `${allNews.length > 0 ? (sentiment.negativeCount / allNews.length) * 100 : 0}%` }} />
              <div className="h-full bg-muted-foreground/30" style={{ width: `${allNews.length > 0 ? (sentiment.neutralCount / allNews.length) * 100 : 0}%` }} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {sentiment.positiveCount} pozitif, {sentiment.negativeCount} negatif, {sentiment.neutralCount} nötr
          </span>
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="animate-pulse text-muted-foreground">Haberler yükleniyor...</div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((n) => (
          <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              {n.thumbnail ? (
                <img src={n.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" loading="lazy" />
              ) : (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${n.impact === "high" ? "bg-destructive/20 text-destructive" : n.impact === "medium" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  <Newspaper className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{n.tag}</span>
                  <span className="text-xs text-muted-foreground">{n.source}</span>
                  <span className="text-xs text-muted-foreground">&bull;</span>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <h3 className="font-semibold text-base">{n.title}</h3>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </a>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">Bu kategoride haber bulunamadı.</div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
        Haberler Yahoo Finance tarafından sağlanmaktadır.
      </div>
    </AppShell>
  );
}
