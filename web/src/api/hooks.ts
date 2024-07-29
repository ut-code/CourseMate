import endpoints from "./internal/endpoints";
import { useAuthorizedData } from "../hooks/useData";
import type { User } from "../common/types";

type Hook<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
};

// TODO: install typia or zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  return useAuthorizedData<User[]>(url);
}

export function usePendingUsers(): Hook<User[]> {
  const url = endpoints.pendingUsers;
  return useAuthorizedData<User[]>(url);
}

export function useMe(): Hook<User> {
  const url = endpoints.me;
  return useAuthorizedData<User>(url);
}

export default {
  useMatchedUsers,
  usePendingUsers,
  useMe,
};
