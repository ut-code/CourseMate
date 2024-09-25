import { useCallback, useEffect, useState } from "react";

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
  // just a dev assertion; don't mind this. it can simply be removed on prod.
  assertUnique(cacheKey, fetcher);
  console.log("useSWR: rendering...");
  const [state, setState] = useState<State<T>>(() => ({
    current: "loading",
    data: null,
  }));

  const reload = useCallback(async () => {
    console.log("useSWR: updating...");
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
        console.error(`useSWR: Schema Parse Error: ${result.error}`);
        return;
      }
      setState({
        // Success
        data: result.data,
        current: "success",
      });
      localStorage.setItem(cacheKey, JSON.stringify(data));
      console.log("useSWR: update success");
    } catch (e) {
      setState({
        data: null,
        current: "error",
        error: e as Error,
      });
      console.log("useSWR: update fail");
    }
  }, [cacheKey, fetcher, schema]);

  useEffect(() => {
    const oldData = localStorage.getItem(cacheKey);
    if (oldData) {
      try {
        const data = JSON.parse(oldData);
        setState({
          current: "stale",
          data,
        });
      } catch {}
    }

    go(reload);
  }, [cacheKey, reload]);

  if (!state) throw new Error("this isn't right!");
  return {
    state,
    reload,
  };
}

function go(fn: () => Promise<void>) {
  fn();
}

const __assertion_function_must_not_be_inlined = new Map<
  string,
  () => unknown
>();
function assertUnique(key: string, ptr: () => unknown) {
  const prev = __assertion_function_must_not_be_inlined.get(key);
  if (prev && prev !== ptr)
    throw new Error(`useSWR: Assertion Failed: different function is assigned for same key: "${key}".
    make sure you are following:
    - do NOT use inline functions like in useSWR(() => inner());
      instead use like this: 
        useSWR(inner);

      or like this:
        const fetcher = () => inner(params);
        useSWR(fetcher)

    - do NOT use same key for different caches.`);
}
