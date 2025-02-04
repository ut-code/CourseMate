import { Err, Ok, type Result } from "common/lib/result";
import { useCallback, useEffect, useState } from "react";
import { credFetch } from "~/firebase/auth/lib";

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

async function safeReadData<T>(
  url: string,
  schema: Zod.Schema<T>,
): Promise<Result<T>> {
  try {
    const res = await credFetch("GET", url);
    const data = await res.json();
    const result = schema.parse(data);
    return Ok(result);
  } catch (e) {
    console.error(`
      safeReadData: Schema Parse Error | in incoming data | Error: ${e}`);
    return Err(e);
  }
}

// TODO: refactor this to look better.
/**
  DANGER: `schema` は *絶対に* inline で書いてはいけない。
  inline で書くと、無限描画ループに陥る。
  例:
  ```javascript
  // BAD
  function Component() {
    const data = useAuthorizedData("/path", z.array(z.number()));
  }
  // GOOD
  const schema = z.array(z.number());

  function Component() {
    const data = useAuthorizedData("/path", schema);
  }
  ```
 */
export function useAuthorizedData<T>(url: string, schema: Zod.Schema<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await safeReadData<T>(url, schema);
    if (result.ok) {
      setData(result.value);
      setLoading(false);
      return;
    }
    setError(result.error as Error);
    setData(null);
    setLoading(false);
  }, [url, schema]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
