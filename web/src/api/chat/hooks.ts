import { z } from "zod";
// import { useCallback, useEffect, useState } from "react";
import type { RoomOverview } from "../../common/types";
import { RoomOverviewSchema } from "../../common/zod/schemas";
import { type Hook, useSWR } from "../../hooks/useSWR";
// import type { Hook } from "../share/types";
import * as chat from "./chat";

const OverviewListSchema = z.array(RoomOverviewSchema);
export function useRoomsOverview(): Hook<RoomOverview[]> {
  return useSWR(
    "COURSEMATE_CACHE__useRoomsOverview",
    chat.overview,
    OverviewListSchema,
  );
}
// export function useRoomsOverview(): Hook<RoomOverview[]> {
//   const [data, setData] = useState<RoomOverview[] | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const reload = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await chat.overview();
//       setData(data);
//       setError(null);
//       setLoading(false);
//     } catch (e) {
//       setData(null);
//       setError(e as Error);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     reload();
//   }, [reload]);

//   return {
//     data,
//     error,
//     loading,
//     reload,
//   };
// }
