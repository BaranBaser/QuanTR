import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useServerFn } from "@tanstack/react-start";
import { fetchNews } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/haberler")({ component: NewsPage });

const tags = ["Tümü", "Ekonomi", "BIST", "Döviz", "Emtia", "Global", "Piyasa"];

function NewsPage() {
  const [tag, setTag] = useState("Tümü");
  const [sourceFilter, setSourceFilter] = useState("Tümü");
  const fetchNewsFn = useServerFn(fetchNews);

  const { data: allNews = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      try { return await fetchNewsFn({}); } catch { return []; }
    },
    staleTime: 300_000,
    throwOnError: false,
  });

  const sources = ["Tümü", ...Array.from(new Set(allNews.map((n) => n.source)))];
  const filtered = allNews.filter((n) => {
    if (tag !== "Tümü" && n.tag !== tag) return false;
    if (sourceFilter !== "Tümü" && n.source !== sourceFilter) return false;
    return true;
  });

  return (
    <AppShell>
      <PageHeader
        title="Haberler"
        subtitle="Piyasadan en güncel haberler ve gelişmeler."
        action={
          <button onClick={() => refetch()} disabled={isFetching} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Yenile
          </button>
        }
      />

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
