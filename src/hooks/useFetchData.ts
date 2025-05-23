import { useState, useEffect, useCallback } from "react";

interface FetchDataOptions<TParams> {
  fetchFn: (params?: TParams) => Promise<any>;
  params?: TParams;
  initialData?: any;
  enabled?: boolean; // To conditionally trigger fetch
}

function useFetchData<TData, TParams = undefined>({
  fetchFn,
  params,
  initialData = null,
  enabled = true,
}: FetchDataOptions<TParams>) {
  const [data, setData] = useState<TData | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0); // For paginated data

  const fetchData = useCallback(
    async (currentParams?: TParams) => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFn(currentParams || params);
        // Adapt based on how your services return data and totalCount
        if (response && typeof response === "object") {
          if ("articles" in response && "totalCount" in response) {
            // For getAllArticles like structure
            setData(response.articles as TData);
            setTotalCount(response.totalCount);
          } else if (
            "data" in response &&
            response.data &&
            typeof response.data === "object" &&
            !Array.isArray(response.data) &&
            Object.keys(response.data).length > 0 &&
            !("articles" in response.data)
          ) {
            // for single article getArticleBySlug or getArticleById
            setData(response.data as TData);
          } else {
            // For other structures or direct data
            setData(response as TData);
          }
        } else {
          setData(response as TData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
        setData(initialData); // Optionally reset data on error
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, params, enabled, initialData]
  );

  useEffect(() => {
    // Check if params is an object and if it has any keys.
    // If params is an empty object, it might mean we are waiting for some dynamic params.
    // This check prevents an initial fetch with undefined/empty params if `enabled` is true by default
    // but the actual parameters (e.g., from URL) are not yet available.
    const areParamsSet =
      params && typeof params === "object"
        ? Object.keys(params).length > 0
        : params !== undefined;

    if (enabled && (params === undefined || areParamsSet)) {
      fetchData();
    } else if (!enabled) {
      setIsLoading(false); // Ensure loading is false if not enabled
      setData(initialData); // Reset to initial data if not enabled
    }
  }, [fetchData, enabled, params, initialData]); // Add params and initialData to dependency array

  return { data, isLoading, error, totalCount, refetch: fetchData };
}

export default useFetchData;
