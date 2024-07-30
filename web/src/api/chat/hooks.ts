import { useCallback, useState } from "react";
import { Hook } from "../share/types";
import * as chat from "./chat";
import type { RoomOverview } from "./chat";

export function useRoomsOverview(): Hook<RoomOverview[]> {
  const [data, setData] = useState<RoomOverview[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chat.entry();
      setData(data);
      setError(null);
      setLoading(false);
    } catch (e) {
      setData(null);
      setError(e as Error);
      setLoading(false);
    }
  }, []);
  
  return {
    data,
    error,
    isLoading,
    reload,
  }
}
