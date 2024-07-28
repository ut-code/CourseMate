import endpoints from "./internal/endpoints";
import { useAuthorizedData } from "../hooks/useData";
import type { User } from "../../../common/types";

type Hook<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
};

// TODO: install typia or zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  const hook = useAuthorizedData(url);
  return {
    data: hook.data as User[] | null,
    isLoading: hook.isLoading,
    error: hook.error,
    reload: hook.reload,
  };
}

export function usePendingUsers(): Hook<User[]> {
  const url = endpoints.pendingUsers;
  const hook = useAuthorizedData(url);
  return {
    data: hook.data as User[] | null,
    isLoading: hook.isLoading,
    error: hook.error,
    reload: hook.reload,
  };
}

export default {
  useMatchedUsers,
  usePendingUsers,
};
