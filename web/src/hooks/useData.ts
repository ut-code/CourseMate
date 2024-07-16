import { useCallback, useEffect, useState } from "react";

// TODO: separate this into concrete types and urls s.t. there is no unsafe any
// also use sth like Typia (or Zod if you really like it)
export default function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Response was not ok.");
      const result = await response.json();
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        setData(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, fetchData };
}
