import { parse, stringify } from "devalue";
import { useCallback, useEffect, useState } from "react";
import type { ZodSchema } from "zod";

// while using previous cache and (may or may not) waiting for fetch success
type Stale<T> = {
  data: T;
  current: "stale";
  error: null;
};
// only occurs on first load.
type Loading = {
  data: null;
  current: "loading";
  error: null;
};
// success. is the latest data.
type Success<T> = {
  data: T;
  current: "success";
  error: null;
};
// first load AND fetching failed
type Failed = {
  data: null;
  current: "error";
  error: Error;
};

export type State<T> = Stale<T> | Loading | Success<T> | Failed;
export type Hook<T> = {
  state: State<T>;
  reload: () => void;
  write: (t: T) => void; // write to local cache, but not reload
};

const SWR_PREFIX = "CourseMate::useSWR::";
// todo: consider using useSWR Hook from external instead.
/**
 use static function instead of inline arrow function
 to prevent unnecessary useCallback calls.
 cacheKey **MUST** be unique in all the codebase, otherwise the cache will interfere each other.
 (I recommend using URL Path, friend's name + unique prefix, or randomly generate static string.)
 **/
export function useSWR<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  schema: Zod.Schema<T>,
): Hook<T> {
  const CACHE_KEY = SWR_PREFIX + cacheKey;

  const [state, setState] = useState<State<T>>(() =>
    loadOldData(CACHE_KEY, schema),
  );

  const reload = useCallback(async () => {
    setState((state) =>
      state.data === null
        ? {
            current: "loading",
            data: null,
            error: null,
          }
        : {
            current: "stale",
            data: state.data,
            error: null,
          },
    );

    try {
      const data = await fetcher();
      const result = schema.safeParse(data);
      if (!result.success) {
        console.error(
          `useSWR: Schema Parse Error | in incoming data | at schema ${CACHE_KEY} | Error: ${result.error.message}`,
        );
        console.log("data:", data);
      }
      setState({
        data: data,
        current: "success",
        error: null,
      });
      localStorage.setItem(CACHE_KEY, stringify(data));
    } catch (e) {
      setState({
        data: null,
        current: "error",
        error: e as Error,
      });
    }
  }, [CACHE_KEY, fetcher, schema]);

  const write = useCallback(
    (data: T) => {
      localStorage.setItem(CACHE_KEY, stringify(data));
    },
    [CACHE_KEY],
  );

  useEffect(() => {
    go(reload);
  }, [reload]);

  return {
    state,
    reload,
    write,
  };
}

function loadOldData<T>(
  CACHE_KEY: string,
  schema: ZodSchema<T>,
): Loading | Stale<T> {
  const oldData = localStorage.getItem(CACHE_KEY);
  if (oldData) {
    try {
      const data = parse(oldData);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        console.error(
          `useSWR: zodParseError | in stale data | at schema ${CACHE_KEY} | ${parsed.error}`,
        );
        console.log("data:", data);
        // because loading old data isn't critical to the application and wrong stale data may cause several problems,
        throw "";
      }
      return {
        current: "stale",
        data,
        error: null,
      };
    } catch {}
  }
  return {
    current: "loading",
    data: null,
    error: null,
  };
}

function go(fn: () => Promise<void>) {
  fn();
}
