import endpoints from "./internal/endpoints";
import useData from "../hooks/useData";
import { assertUser } from "../../../common/typia";
import type { User } from "../../../common/types";

type Hook<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
};

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  const { data, isLoading, error, reload } = useData<User[]>(url);

  const validatedData = data ? data.map(assertUser) : null;

  return { data: validatedData, isLoading, error, reload };
}

export function usePendingUsers(): Hook<User[]> {
  const url = endpoints.pendingUsers;
  const { data, isLoading, error, reload } = useData<User[]>(url);

  const validatedData = data ? data.map(assertUser) : null;

  return { data: validatedData, isLoading, error, reload };
}

export default {
  useMatchedUsers,
  usePendingUsers,
};
