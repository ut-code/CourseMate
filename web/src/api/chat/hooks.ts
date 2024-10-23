import { useCallback } from "react";
import { z } from "zod";
// import { useCallback, useEffect, useState } from "react";
import type { Message, RoomOverview } from "../../common/types";
import { MessageSchema, RoomOverviewSchema } from "../../common/zod/schemas";
import { type Hook, useSWR } from "../../hooks/useSWR";
import type { UserID } from "../internal/endpoints";
// import type { Hook } from "../share/types";
import * as chat from "./chat";

const OverviewListSchema = z.array(RoomOverviewSchema);
export function useRoomsOverview(): Hook<RoomOverview[]> {
  return useSWR("useRoomsOverview", chat.overview, OverviewListSchema);
}

const MessageListSchema = z.array(MessageSchema);
// 相手のIDを指定して、
export function useMessages(friendId: UserID): Hook<Message[]> {
  const key = `chat::dm::${friendId}`;
  const fetcher = useCallback(
    async () => (await chat.getDM(friendId)).messages,
    [friendId],
  );
  return useSWR(key, fetcher, MessageListSchema);
}
