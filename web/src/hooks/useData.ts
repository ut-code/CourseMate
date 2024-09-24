import { useCallback, useEffect, useState } from "react";
import { Err, Ok, type Result } from "../common/lib/result";
import { credFetch } from "../firebase/auth/lib";

// TODO: separate this into concrete types and urls s.t. there is no unsafe any
// also use sth like something like Zod
export default function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
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
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

async function safeReadData<T>(url: string): Promise<Result<T>> {
  try {
    const res = await credFetch("GET", url);
    const result = await res.json();
    // TODO: zod
    return Ok(result);
  } catch (e) {
    return Err(e);
  }
}

// TODO: refactor this to look better.
export function useAuthorizedData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await safeReadData<T>(url);
    if (result.ok) {
      setData(result.value);
      setLoading(false);
      return;
    }
    setError(result.error as Error);
    setData(null);
    setLoading(false);
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
