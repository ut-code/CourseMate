import endpoints from "./internal/endpoints";
import useData from "../hooks/useData";
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
  return useData<User[]>(url);
}

export function usePendingUsers(): Hook<User[]> {
  const url = endpoints.pendingUsers;
  return useData<User[]>(url);
}

export default {
  useMatchedUsers,
  usePendingUsers,
};
