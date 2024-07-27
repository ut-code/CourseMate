import { useCallback, useEffect, useState } from "react";
import { ErrUnauthorized, refreshIdToken } from "../firebase/auth/lib";
import { Ok, Err } from "../dev/copied/common/lib/result";

// TODO: separate this into concrete types and urls s.t. there is no unsafe any
// also use sth like Typia (or Zod if you really like it)
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

// TODO: refactor this to look better.
export function useAuthorizedData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const safeReadData = async () => {
    try {
      const res = await fetch(url, {
        credentials: "include",
      });
      if (res.status === 401) throw new ErrUnauthorized();
      if (!res.ok) throw new Error("Response was not ok.");
      const result = await res.json();
      setData(result);
      return Ok(null);
    } catch (e) {
      if (error instanceof Error) {
        setError(error);
        setData(null);
      }
      return Err(e);
    }
  };

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await safeReadData();
    if (!result.ok) {
      await refreshIdToken();
      await safeReadData();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
