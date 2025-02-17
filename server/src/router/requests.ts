import { zValidator } from "@hono/zod-validator";
import type { UserID } from "common/types";
import { Hono } from "hono";
import { z } from "zod";
import {
  approveRequest,
  cancelRequest,
  rejectRequest,
  sendRequest,
} from "../database/requests";
import { getUserId } from "../firebase/auth/db";
import { error } from "../lib/error";
import { param } from "../lib/validator";

const router = new Hono();

// リクエストの送信
router.put(
  "/send/:receiverId",
  zValidator("param", z.object({ receiverId: z.coerce.number() })),
  async (c) => {
    const receiverId = c.req.valid("param").receiverId;
    const senderId = await getUserId(c);
    const sentRequest = await sendRequest({
      senderId: senderId,
      receiverId: receiverId as UserID,
    });
    c.status(201);
    return c.json(sentRequest);
  },
);

// リクエストの承認
router.put(
  "/accept/:senderId",
  param({ senderId: z.coerce.number() }),
  async (c) => {
    const senderId = c.req.valid("param").senderId;
    const receiverId = await getUserId(c);

    await approveRequest(senderId as UserID, receiverId);
    c.status(201);
    c.json({});
  },
);

router.put(
  "/cancel/:opponentId",
  param({ opponentId: z.coerce.number() }),
  async (c) => {
    const opponentId = c.req.valid("param").opponentId;
    const requesterId = await getUserId(c);
    await cancelRequest(requesterId, opponentId);
  },
);

// リクエストの拒否
router.put(
  "/reject/:opponentId",
  param({ opponentId: z.coerce.number() }),
  async (c) => {
    const opponentId = c.req.valid("param").opponentId;
    const requesterId = await getUserId(c);

    await rejectRequest(opponentId as UserID, requesterId); //TODO 名前を良いのに変える
    c.status(204);
    c.json({});
  },
);

export default router;
