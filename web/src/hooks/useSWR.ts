import { useCallback, useEffect, useState } from "react";
import type { ZodSchema } from "zod";

// while using previous cache and (may or may not) waiting for fetch success
type Stale<T> = {
  data: T;
  current: "stale";
};
// only occurs on first load.
type Loading = {
  data: null;
  current: "loading";
};
// success. is the latest data.
type Success<T> = {
  data: T;
  current: "success";
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

  // just a dev assertion, don't mind this. it can simply be removed on prod.
  assertUnique(CACHE_KEY, fetcher, schema);

  const [state, setState] = useState<State<T>>(() =>
    loadOldData(CACHE_KEY, schema),
  );

  const reload = useCallback(async () => {
    console.log("useSWR: reloading...");
    setState((state) =>
      state.data === null
        ? {
            current: "loading",
            data: null,
          }
        : {
            current: "stale",
            data: state.data,
          },
    );

    try {
      const data = await fetcher();
      const result = schema.safeParse(data);
      if (!result.success) {
        console.error(
          `WARNING: useSWR: UNEXPECTED ZOD PARSE ERROR: Schema Parse Error: ${result.error.message}`,
        );
      }
      setState({
        data: data,
        current: "success",
      });
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      console.log("useSWR: update success");
    } catch (e) {
      setState({
        data: null,
        current: "error",
        error: e as Error,
      });
      console.error("useSWR: update fail");
    }
  }, [CACHE_KEY, fetcher, schema]);

  useEffect(() => {
    go(reload);
  }, [reload]);

  return {
    state,
    reload,
  };
}

function loadOldData<T>(
  CACHE_KEY: string,
  schema: ZodSchema<T>,
): Loading | Stale<T> {
  const oldData = localStorage.getItem(CACHE_KEY);
  if (oldData) {
    try {
      const data = JSON.parse(oldData);
      const parse = schema.safeParse(data);
      if (!parse.success)
        console.error(`useSWR: zodParseError: ${parse.error}`);
      return {
        current: "stale",
        data,
      };
    } catch {}
  }
  return {
    current: "loading",
    data: null,
  };
}

function go(fn: () => Promise<void>) {
  fn();
}

const __function_must_not_be_inlined = new Map<string, () => unknown>();
const __zod_schema_must_not_be_inlined = new Map<string, ZodSchema>();

function assertUnique(key: string, func: () => unknown, schema: ZodSchema) {
  const prevSchema = __zod_schema_must_not_be_inlined.get(key);
  if (prevSchema && prevSchema !== schema) {
    throw new Error(
      `useSWR: Assertion Failed: schema differs from when it was first assigned. assigned key: ${key}
      make sure you do it likes this:

        const schema = z.array(z.number());
        function Component() {
          useSWR(schema);
        }

      and not this:

        function Component() {
          useSWR(z.array(z.number()));
        }
      `,
    );
  }
  const prev = __function_must_not_be_inlined.get(key);
  if (prev && prev !== func)
    throw new Error(`useSWR: Assertion Failed: different function is assigned for same key: "${key}".
    make sure you are following:
    1. do NOT use inline functions like this:

      useSWR(() => inner());

    instead use like this: 
    
      useSWR(inner);

    or like this:

      const fetcher = () => inner(params);
      function Component() {
        useSWR(fetcher);
      }

    2. do NOT use same key for different caches.`);
  __function_must_not_be_inlined.set(key, func);
}
