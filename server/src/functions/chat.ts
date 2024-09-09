import { RoomOverview } from "../common/types";
import { HTTPResult } from "./share/result";
import * as db from "../database/chat";
import { Result } from "../common/lib/result";

export async function getOverview(id: number): HTTPResult<RoomOverview[]>{
  const overview: Result<RoomOverview[]> = await db.getOverview(id);
  if (!overview.ok) {
    console.error(overview.error);
    return {
      ok: false,
      code: 500,
      body: overview.error as string,
    };
  }

  return {
    ok: true,
    code: 200,
    body: overview.value,
  }
  // SEND: RoomOverview[].
  // this is NOT ordered. you need to sort it on frontend.
  
}
