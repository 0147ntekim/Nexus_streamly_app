import { useEffect, useState } from "react";

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher(controller.signal);
        setData(result);
      } catch (err) {
        if (err.name === "AbortError") return; // we cancelled on purpose
        setError(err);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();

    // Cleanup: cancel the request if deps change or the component unmounts
    return () => controller.abort();

    // `fetcher` is intentionally excluded: callers re-run the effect by
    // listing what matters (e.g. a search term) in `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  function refetch() {
    setReloadCount((count) => count + 1);
  }

  return { data, isLoading, error, refetch };
}