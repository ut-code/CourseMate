import endpoints from "./internal/endpoints";
import { useAuthorizedData } from "../hooks/useData";
import type { User } from "../common/types";
import type { Hook } from "./share/types";

// TODO: install typia or zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestsToMe(): Hook<User[]> {
  const url = endpoints.pendingRequestsToMe;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestsFromMe(): Hook<User[]> {
  const url = endpoints.pendingRequestsFromMe;
  return useAuthorizedData<User[]>(url);
}

export function useMe(): Hook<User> {
  const url = endpoints.me;
  return useAuthorizedData<User>(url);
}

export default {
  useMatchedUsers,
  usePendingRequestsToMe,
  usePendingRequestsFromMe,
  useMe,
};
