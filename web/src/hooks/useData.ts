import { useCallback, useEffect, useState } from "react";
import { ErrUnauthorized, refreshIdToken } from "../firebase/auth/lib";
import { Result, Ok, Err } from "../dev/copied/common/lib/result";

// TODO: separate this into concrete types and urls s.t. there is no unsafe any
// also use sth like Typia (or Zod if you really like it)
export default function useData(url: string) {
  const [data, setData] = useState<unknown | null>(null);
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

async function safeReadData(url: string): Promise<Result<unknown>> {
  try {
    const res = await fetch(url, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (!res.ok) throw new Error("Response was not ok.");
    const result = await res.json();
    // TODO: typia
    return Ok(result);
  } catch (e) {
    return Err(e);
  }
}

// TODO: refactor this to look better.
export function useAuthorizedData(url: string) {
  const [data, setData] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // this never throws. I'm only using this to use finally
    try {
      let result = await safeReadData(url);
      if (result.ok) {
        setData(result.value);
        return;
      }
      await refreshIdToken();
      result = await safeReadData(url);
      if (result.ok) {
        setData(result.value);
        return;
      }
      setError(result.error as Error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
