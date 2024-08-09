import endpoints from "./internal/endpoints";
import { useAuthorizedData } from "../hooks/useData";
import type { User } from "../common/types";
import type { Hook } from "./share/types";

// TODO: install typia or zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestToMe(): Hook<User[]> {
  const url = endpoints.pendingRequestToMe;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestFromMe(): Hook<User[]> {
  const url = endpoints.pendingRequestFromMe;
  return useAuthorizedData<User[]>(url);
}

export function useMe(): Hook<User> {
  const url = endpoints.me;
  return useAuthorizedData<User>(url);
}

export default {
  useMatchedUsers,
  usePendingRequestToMe,
  usePendingRequestFromMe,
  useMe,
};
