import express, { Request, Response } from "express";
import { type Relationship } from "../../../common/types";

import {
  approveRequest,
  getRequestsByUserId,
  rejectRequest,
  sendRequest,
} from "../database/requests";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../../../common/lib/result/safeParseInt";
// import { Relationship } from "@prisma/client"; // ... not used?

const router = express.Router();

// I'm pretty sure that this is not used, but I'm not confident enough to delete this
// 特定のユーザ同士が送信・受信したマッチリクエストの取得
// router.get("/id/:matchId", async (req: Request, res: Response) => {
//   const { senderId, receiverId } = req.query;
//   if (!senderId && !receiverId) {
//     return res
//       .status(400)
//       .json({ error: "SenderID or ReceiverID is required" });
//   }
//   try {
//     const requests: Relationship[] = await getRequestsByUserId({
//       senderId: senderId ? parseInt(senderId as string) : undefined,
//       receiverId: receiverId ? parseInt(receiverId as string) : undefined,
//     });
//     res.status(200).json(requests);
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     res.status(500).json({ error: "Failed to fetch requests" });
//   }
// });

//特定のユーザーにまつわるpendingリクエストを取得
router.get("/", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");

  try {
    const requests: Relationship[] = await getRequestsByUserId({
      // FIXME: isn't it supposed to be receiver id?
      senderId: userId.value,
    });
    const pending = requests.filter((r) => r.status === "PENDING");
    res.status(200).json(pending);
  } catch (error) {
    console.error("Error fetching matching requests", error);
    res.status(500).json({ error: "Failed to fetch matching requests" });
  }
});

// リクエストの送信
router.put("/send/:receiverId", async (req: Request, res: Response) => {
  const receiverId = safeParseInt(req.params.receiverId);
  if (!receiverId.ok) return res.status(400).send("bad param encoding");

  const senderId = await safeGetUserId(req);
  if (!senderId.ok) return res.status(401).send("auth error");

  try {
    const sentRequest = await sendRequest({
      senderId: senderId.value,
      receiverId: receiverId.value,
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
    await approveRequest(senderId.value, receiverId.value);
    res.status(201).send();
  } catch (error) {
    console.error("Error approving match request:", error);
    res.status(500).json({ error: "Failed to approve match request" });
  }
});

// リクエストの拒否
router.put("/reject/:opponentId", async (req: Request, res: Response) => {
  const opponentId = safeParseInt(req.params.opponentId);
  if (!opponentId.ok) return res.status(400).send("bad param encoding");

  const requesterId = await safeGetUserId(req);
  if (!requesterId.ok) return res.status(401).send("auth error");

  try {
    await rejectRequest(opponentId.value, requesterId.value); //TODO 名前を良いのに変える
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

export default router;
