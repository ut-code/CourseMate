import { useCallback, useEffect, useState } from "react";
import type { RoomOverview } from "../../common/types";
import type { Hook } from "../share/types";
import * as chat from "./chat";

export function useRoomsOverview(): Hook<RoomOverview[]> {
  const [data, setData] = useState<RoomOverview[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chat.overview();
      setData(data);
      setError(null);
      setLoading(false);
    } catch (e) {
      setData(null);
      setError(e as Error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    data,
    error,
    loading,
    reload,
  };
}
