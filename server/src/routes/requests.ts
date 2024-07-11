import express, { Request, Response } from "express";

import {
  approveRequest,
  getRequestsByUserId,
  rejectRequest,
  sendRequest,
  searchSenderByReceiverId,
  searchMatchedUser
} from "../database/requests";
import { Relationship } from "@prisma/client";

const router = express.Router();

// 特定のユーザ同士が送信・受信したマッチリクエストの取得
router.get("/id/:matchId", async (req: Request, res: Response) => {
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
router.get("/receiverId/:userId", async (req:Request, res:Response) => {
  const { userId } = req.params;
  try {
    const senders = await searchSenderByReceiverId(parseInt(userId));
    // パスワード以外を返す
    const sendersWithoutPassword = senders.map((sender) => {
      const { password, ...senderWithoutPassword } = sender;
      return senderWithoutPassword;
    });
    res.status(200).json(sendersWithoutPassword);
  } catch(error) {
    console.error("Error fetching matching requests", error);
    res.status(500).json({error: "Failed to fetch matching requests"});
  }
})

//特定のユーザーとマッチしたユーザーを取得
router.get("/matched/:userId", async (req:Request, res:Response) => {
  const { userId } = req.params;
  try {
    const matchedUsers = await searchMatchedUser(parseInt(userId));
    // パスワード以外を返す
    const matchedUsersWithoutPassword = matchedUsers.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.status(200).json(matchedUsersWithoutPassword);
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
router.put("/accept/:senderId/:receiverId", async (req: Request, res: Response) => {
  const { senderId, receiverId} = req.params;
  try {
    await approveRequest(parseInt(senderId), parseInt(receiverId));
    res.status(204).send();
  } catch (error) {
    console.error("Error approving match request:", error);
    res.status(500).json({ error: "Failed to approve match request" });
  }
});


// マッチリクエストの拒否
router.put("/reject/:senderId/:receiverId", async (req: Request, res: Response) => {
  const { senderId, receiverId} = req.params;
  try {
    await rejectRequest(parseInt(senderId), parseInt(receiverId));
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

export default router;
