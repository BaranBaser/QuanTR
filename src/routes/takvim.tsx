import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useServerFn } from "@tanstack/react-start";
import { fetchCalendar } from "@/lib/ai.functions";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, CalendarX } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/takvim")({
  head: () => ({
    meta: [
      { title: "Ekonomik Takvim — stockbear" },
      { name: "description", content: "Yaklaşan ekonomik olayları ve verileri takip edin." },
      { property: "og:title", content: "Ekonomik Takvim — stockbear" },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const fetchCalFn = useServerFn(fetchCalendar);
  const [countryFilter, setCountryFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");

  const { data: events = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      try { return await fetchCalFn({}); } catch { return []; }
    },
    staleTime: 600_000,
    throwOnError: false,
  });

  const countries = useMemo(() => {
    const set = new Set(events.map((e: { country: string }) => e.country));
    return ["all", ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e: { country: string; impact: string }) => {
      if (countryFilter !== "all" && e.country !== countryFilter) return false;
      if (impactFilter !== "all" && e.impact !== impactFilter) return false;
      return true;
    });
  }, [events, countryFilter, impactFilter]);

  return (
    <AppShell>
      <PageHeader
        title="Ekonomik Takvim"
        subtitle="Yaklaşan ekonomik veriler, faiz kararları ve önemli olaylar."
        action={
          <button onClick={() => refetch()} disabled={isFetching} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Yenile
          </button>
        }
      />

      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="animate-pulse text-muted-foreground">Ekonomik takvim yükleniyor...</div>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm">
            {countries.map((c) => (
              <option key={c} value={c}>{c === "all" ? "Tüm Ülkeler" : c}</option>
            ))}
          </select>
          <select value={impactFilter} onChange={(e) => setImpactFilter(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm">
            <option value="all">Tüm Etki</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left p-3 font-normal">Tarih</th>
              <th className="text-left font-normal">Saat</th>
              <th className="text-left font-normal">Ülke</th>
              <th className="text-left font-normal">Olay</th>
              <th className="text-center font-normal">Etki</th>
              <th className="text-right font-normal">Beklenti</th>
              <th className="text-right font-normal pr-3">Önceki</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((e, i) => (
              <tr key={i} className="border-b border-border hover:bg-secondary/40">
                <td className="p-3 font-semibold">{e.date}</td>
                <td className="text-muted-foreground">{e.time}</td>
                <td className="text-lg">{e.country}</td>
                <td className="font-medium">{e.event}</td>
                <td className="text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${e.impact === "high" ? "bg-destructive" : e.impact === "medium" ? "bg-primary" : "bg-muted-foreground"}`} />
                  <span className={`inline-block w-2 h-2 rounded-full mx-0.5 ${e.impact === "high" || e.impact === "medium" ? "bg-primary" : "bg-muted"}`} />
                  <span className={`inline-block w-2 h-2 rounded-full ${e.impact === "high" ? "bg-destructive" : "bg-muted"}`} />
                </td>
                <td className="text-right font-mono text-primary">{e.forecast}</td>
                <td className="text-right font-mono text-muted-foreground pr-3">{e.previous}</td>
              </tr>
            ))}
            {!isLoading && filteredEvents.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  <CalendarX className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {events.length === 0
                      ? "Henüz ekonomik veri bulunmuyor."
                      : "Bu filtrelere uygun olay bulunamadı."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Yüksek Etki</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Orta Etki</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" /> Düşük Etki</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
        Veriler FairEconomy API tarafından sağlanmaktadır.
      </div>
    </AppShell>
  );
}
