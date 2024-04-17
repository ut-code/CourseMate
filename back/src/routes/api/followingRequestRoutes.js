// followingRequestRoutes.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getFollowingRequests, createFollowingRequest, updateFollowingRequestStatus } from '../../helpers/prismaHelpers.js';

const prisma = new PrismaClient();
const router = express.Router();

// 特定のユーザーが送信したフォローリクエストの取得
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const followingRequests = await getFollowingRequests(parseInt(userId));
    res.json(followingRequests);
  } catch (error) {
    console.error("Error fetching following requests:", error);
    res.status(500).json({ error: "Failed to fetch following requests" });
  }
});

// フォローリクエストの作成エンドポイント
router.post('/', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const followingRequest = await createFollowingRequest(senderId, receiverId);
    res.json(followingRequest);
  } catch (error) {
    console.error("Error creating following request:", error);
    res.status(500).json({ error: "Failed to create following request" });
  }
});

// フォローリクエストの更新エンドポイント（受信者がフォローリクエストを受け入れるか拒否する）
router.put('/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  const { newStatus } = req.body;

  try {
    const updatedRequest = await updateFollowingRequestStatus(parseInt(senderId), newStatus, parseInt(receiverId));
    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating following request status:", error);
    res.status(500).json({ error: "Failed to update following request status" });
  }
});

export default router;
