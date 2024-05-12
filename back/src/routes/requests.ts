import express, { Request, Response } from "express";

import {
  approveRequest,
  getRequestsByUserId,
  rejectRequest,
  sendRequest,
  searchRequestedUser
} from "../helpers/requestHelper";
import { Relationship } from "@prisma/client";

const router = express.Router();

// 特定のユーザ同士が送信・受信したマッチリクエストの取得
router.get("/:matchId", async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.query;
  if (!senderId && !receiverId) {
    return res.status(400).json({ error: "SenderID or ReceiverID is required" });
  }
  try {
    const requests = await getRequestsByUserId({
      senderId: senderId ? parseInt(senderId as string) : undefined,
      receiverId: receiverId ? parseInt(receiverId as string) : undefined,
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

//特定のユーザーにまつわるマッチリクエストを取得
router.post("/:userId", async (req:Request, res:Response) => {
  const { userId } = req.params;
  try {
    const matchRequests: Relationship[] = await searchRequestedUser(parseInt(userId));
    res.status(201).json(matchRequests);
  } catch(error) {
    console.error("Error fetching matching requests", error);
    res.status(500).json({error: "Failed to fetch matching requests"});
  }
})

// マッチリクエストの送信
router.post("/sendMatchRequest", async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;
  try {
    const sentRequest = await sendRequest({
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
    });
    res.status(201).json(sentRequest);
  } catch (error) {
    console.error("Error sending match request:", error);
    res.status(500).json({ error: "Failed to send match request" });
  }
});

// マッチリクエストの承認
router.put("/accept/:matchId", async (req: Request, res: Response) => {
  const { matchId } = req.params;
  try {
    const approvedRequest = await approveRequest(parseInt(matchId));
    res.status(200).json(approvedRequest);
  } catch (error) {
    console.error("Error approving match request:", error);
    res.status(500).json({ error: "Failed to approve match request" });
  }
});

// マッチリクエストの拒否
router.put("/reject/:matchId", async (req: Request, res: Response) => {
  const { matchId } = req.params;
  try {
    await rejectRequest(parseInt(matchId));
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

export default router;
