export function reportLovableError(error: unknown, meta?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined') {
      // Client-side: print to console for visibility
      // eslint-disable-next-line no-console
      console.error('[lovable] reported error:', error, meta ?? {});
    } else {
      // Server-side: also log to stderr
      // eslint-disable-next-line no-console
      console.error('[lovable] reported server error:', error, meta ?? {});
    }
  } catch (e) {
    // Swallow any reporting errors to avoid cascading failures
  }
}
