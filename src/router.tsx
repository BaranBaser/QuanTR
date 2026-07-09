import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

let queryClient: QueryClient | null = null;
let router: ReturnType<typeof createRouter> | null = null;

export const getRouter = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false },
      },
    });
  }
  if (!router) {
    router = createRouter({
      routeTree,
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
    });
  }
  return router;
};
