import express, { Request, Response } from "express";
import { type Relationship } from "../../../common/types";

import {
  approveRequest,
  getRequestsByUserId,
  rejectRequest,
  sendRequest,
} from "../database/requests";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../../../common/lib/safeParseInt";
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
  const result = await safeGetUserId(req);
  if (!result.ok)
    return res.status(401).send("auth error");
  const userId = result.value;

  try {
    const requests: Relationship[] = await getRequestsByUserId({
      senderId: userId,
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
  const recv = safeParseInt(req.params.receiverId);
  if (!recv.ok)
    return res.status(400).send("bad param encoding");
  const receiverId = recv.value;

  const sdr = await safeGetUserId(req);
  if (!sdr.ok)
    return res.status(401).send("auth error");
  const senderId = sdr.value;

  try {
    const sentRequest = await sendRequest({
      senderId: senderId,
      receiverId: receiverId,
    });
    res.status(201).json(sentRequest);
  } catch (error) {
    console.error("Error sending match request:", error);
    res.status(500).json({ error: "Failed to send match request" });
  }
});

// リクエストの承認
router.put("/accept/:senderId", async (req: Request, res: Response) => {
  const sdr = safeParseInt(req.params.senderId);
  if (!sdr.ok)
    return res.status(400).send("bad param encoding");
  const senderId = sdr.value;

  const rcv = await safeGetUserId(req);
  if (!rcv.ok)
    return res.status(401).send("auth error");
  const receiverId = rcv.value;

  try {
    await approveRequest(senderId, receiverId);
    res.status(201).send();
  } catch (error) {
    console.error("Error approving match request:", error);
    res.status(500).json({ error: "Failed to approve match request" });
  }
});

// リクエストの拒否
router.put("/reject/:opponentId", async (req: Request, res: Response) => {
  const oppn = safeParseInt(req.params.opponentId);
  if (!oppn.ok)
    return res.status(400).send("bad param encoding");
  const opponentId = oppn.value;

  const rqs = await safeGetUserId(req);
  if (!rqs.ok)
    return res.status(401).send("auth error");
  const requesterId = rqs.value;

  try {
    await rejectRequest(requesterId, opponentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

export default router;
