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
  const url = endpoints.matches;
  return useData<User[]>(url);
}

export function usePendingRequests(): Hook<User[]> {
  const url = endpoints.requests;
  return useData<User[]>(url);
}

export default {
  useMatchedUsers,
  usePendingRequests,
};
