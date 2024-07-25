import express, { Request, Response } from "express";
import { type Relationship } from "../../../common/types";

import {
  approveRequest,
  getRequestsByUserId,
  rejectRequest,
  sendRequest,
} from "../database/requests";
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
  const userId = 1; // TODO: get it from auth
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

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
  const receiverId = parseInt(req.params.receiverId);
  const senderId = 1; // TODO: get from auth
  const didAuthenticationFail = false;
  if (didAuthenticationFail) return res.status(401).send("auth error");

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
  const senderId = parseInt(req.params.senderId);
  const receiverId = 1; // TODO: get it from auth
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

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
  const opponentId = parseInt(req.params.opponentId); // TODO: handle zero
  const requesterId = 1; // TODO: GET FROM AUTH
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

  try {
    await rejectRequest(requesterId, opponentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ error: "Failed to reject match request" });
  }
});

export default router;
