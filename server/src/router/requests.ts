import { error } from "common/lib/panic";
import type { UserID } from "common/types";
import express, { type Request, type Response } from "express";
import {
  approveRequest,
  cancelRequest,
  rejectRequest,
  sendRequest,
} from "../database/requests";
import { getUserId } from "../firebase/auth/db";

const router = express.Router();

// リクエストの送信
router.put("/send/:receiverId", async (req: Request, res: Response) => {
  const receiverId =
    Number.parseInt(req.params.receiverId) ??
    error("bad encoding: receiverId", 400);
  const senderId = await getUserId(req);
  try {
    const sentRequest = await sendRequest({
      senderId: senderId,
      receiverId: receiverId as UserID,
    });
    res.status(201).json(sentRequest);
  } catch (error) {
    console.error("Error sending match request:", error);
    res.status(500).json({ error: "Failed to send match request" });
  }
});

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
