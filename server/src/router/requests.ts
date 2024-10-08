import express, { type Request, type Response } from "express";
import type { UserID } from "../common/types";

import { safeParseInt } from "../common/lib/result/safeParseInt";
import {
  approveRequest,
  autoMatch,
  cancelRequest,
  rejectRequest,
  sendRequest,
} from "../database/requests";
import { safeGetUserId } from "../firebase/auth/db";
// import { Relationship } from "@prisma/client"; // ... not used?

const router = express.Router();

// リクエストの送信
router.put("/send/:receiverId", async (req: Request, res: Response) => {
  const receiverId = safeParseInt(req.params.receiverId);
  if (!receiverId.ok) return res.status(400).send("bad param encoding");

  const senderId = await safeGetUserId(req);
  if (!senderId.ok) return res.status(401).send("auth error");

  try {
    const sentRequest = await sendRequest({
      senderId: senderId.value,
      receiverId: receiverId.value as UserID,
    });
    res.status(201).json(sentRequest);
  } catch (error) {
    console.error("Error sending match request:", error);
    res.status(500).json({ error: "Failed to send match request" });
  }
});

// リクエストの承認
router.put("/accept/:senderId", async (req: Request, res: Response) => {
  const senderId = safeParseInt(req.params.senderId);
  if (!senderId.ok) return res.status(400).send("bad param encoding");

  const receiverId = await safeGetUserId(req);
  if (!receiverId.ok) return res.status(401).send("auth error");

  try {
    await approveRequest(senderId.value as UserID, receiverId.value);
    res.status(201).send();
  } catch (error) {
    console.error("Error approving match request:", error);
    res.status(500).json({ error: "Failed to approve match request" });
  }
});

router.put("/cancel/:opponentId", async (req: Request, res: Response) => {
  const opponentId = safeParseInt(req.params.opponentId);
  if (!opponentId.ok) return res.status(400).send("bad param encoding");

  const requesterId = await safeGetUserId(req);
  if (!requesterId.ok) return res.status(401).send("auth error");

  const result = await cancelRequest(requesterId.value, opponentId.value);

  switch (result.ok) {
    case true:
      return res.status(204).send();
    case false:
      return res.status(500).send();
  }
});

// リクエストの拒否
router.put("/reject/:opponentId", async (req: Request, res: Response) => {
  const opponentId = safeParseInt(req.params.opponentId);
  if (!opponentId.ok) return res.status(400).send("bad param encoding");

  const requesterId = await safeGetUserId(req);
  if (!requesterId.ok) return res.status(401).send("auth error");

  try {
    await rejectRequest(opponentId.value as UserID, requesterId.value); //TODO 名前を良いのに変える
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

//オートマッチ(メモ帳、運営等に使用)
router.post("/autoMatch", async (req: Request, res: Response) => {
  const requesterId = await safeGetUserId(req);
  if (!requesterId.ok) return res.status(401).send("auth error");

  try {
    await autoMatch(requesterId.value as UserID);
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

export default router;
