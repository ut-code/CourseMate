import { zValidator } from "@hono/zod-validator";
import { error } from "common/lib/panic";
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
router.put("/accept/:senderId", async (req: Request, res: Response) => {
  const senderId =
    Number.parseInt(req.params.senderId) ??
    error("invalid param encoding: senderId", 400);

  const receiverId = await getUserId(req);

  await approveRequest(senderId as UserID, receiverId);
  res.status(201).send();
});

router.put("/cancel/:opponentId", async (req: Request, res: Response) => {
  const opponentId =
    Number.parseInt(req.params.opponentId) ?? error("bad param encoding", 400);
  const requesterId = await getUserId(req);
  await cancelRequest(requesterId, opponentId);
});

// リクエストの拒否
router.put("/reject/:opponentId", async (req: Request, res: Response) => {
  const opponentId =
    Number.parseInt(req.params.opponentId) ?? error("bad param encoding", 400);
  const requesterId = await getUserId(req);

  await rejectRequest(opponentId as UserID, requesterId); //TODO 名前を良いのに変える
  res.status(204).send();
});

export default router;
