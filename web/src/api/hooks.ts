import endpoints from "./internal/endpoints";
import { useAuthorizedData } from "../hooks/useData";
import type { User } from "../common/types";
import type { Hook } from "./share/types";

// TODO: install typia or zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestForUser(): Hook<User[]> {
  const url = endpoints.pendingRequestforUser;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestByUser(): Hook<User[]> {
  const url = endpoints.pendingRequestByUser;
  return useAuthorizedData<User[]>(url);
}

export function useMe(): Hook<User> {
  const url = endpoints.me;
  return useAuthorizedData<User>(url);
}

export default {
  useMatchedUsers,
  usePendingRequestForUser,
  usePendingRequestByUser,
  useMe,
};
