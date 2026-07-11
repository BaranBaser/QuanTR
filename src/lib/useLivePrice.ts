import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { fetchSingleStock } from "@/lib/ai.functions";

type LivePriceResult = {
  price: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  isLoading: boolean;
};

export function useLivePrice(symbol: string): LivePriceResult {
  const fetchSingle = useServerFn(fetchSingleStock);

  const { data, isLoading } = useQuery({
    queryKey: ["live-price", symbol],
    queryFn: async () => {
      try {
        const result = await fetchSingle({ data: { symbol } });
        if (result?.price) {
          const prevClose = (result as unknown as { prevClose?: number }).prevClose;
          return {
            price: result.price,
            changePercent: prevClose ? ((result.price - prevClose) / prevClose) * 100 : 0,
            volume: result.volume || 0,
            high: result.high || 0,
            low: result.low || 0,
          };
        }
      } catch {}
      return { price: 0, changePercent: 0, volume: 0, high: 0, low: 0 };
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
    throwOnError: false,
  });

  return {
    price: data?.price ?? 0,
    changePercent: data?.changePercent ?? 0,
    volume: data?.volume ?? 0,
    high: data?.high ?? 0,
    low: data?.low ?? 0,
    isLoading,
  };
}
