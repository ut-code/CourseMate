//relationshipRoutes.js

import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// ユーザーが送信したマッチリクエストの取得
router.get('/requesting/:userId', async (req, res) => {
  try {
  const { userId } = req.params;
  return await prisma.relationship.findMany({
    where: {
      AND: [
      {status: 'PENDING'},
      {requestingUserId: userId}
      ]
    },
  });
  } catch(error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
})

//ユーザーに送信されたマッチリクエストの取得
router.get('/requested/:userId', async (req, res) => {
  try {
  const { userId } = req.params;
  return await prisma.relationship.findMany({
    where: {
      AND: [
        {status: 'PENDING'},
        {requestedUserId: userId}
        ]
    },
  });
  } catch(error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  } 
})

//マッチしたユーザーの取得
router.get('/matched/:userId', async (req, res) => {
  try {
    const {userId} = req.params;
    return await prisma.relationship.findMany({
      where: {
        AND:[
          {OR:[
            {requestingUserId: userId},
            {requestedUserId: userId}
          ]},
          {status: 'MATCHED'} 
        ]
        
      }
    });
  } catch(error) {
    console.error("Error fetching matched requests:", error);
    res.status(500).json({ error: "Failed to fetch matched requests" });
  }
})

//マッチリクエストを送る
async function sendMatchRequest(requestingUserId, requestedUserId) {
  await prisma.relationship.create({
    data: {
      requestingUserId: requestingUserId,
      requestedUserId: requestedUserId,
      status: 'PENDING'
    }
  })
}

//マッチリクエストを断る
async function rejectMatchRequest(requestingUserId, requestedUserId) {
   await prisma.relationship.delete({
    where: {
      AND:[
        {requestingUserId: requestingUserId},
        {requestedUserId: requestedUserId},
      ]
    }
   })
}

//マッチする(マッチリクエストを受け入れる)

async function acceptMatchRequest(requestingUserId, requestedUserId) {
  await prisma.relationship.update({
    where: {
      AND:[
        {requestingUserId: requestingUserId},
        {requestedUserId: requestedUserId},
      ]
    },
    data: {
      status: 'MATCHED'
    }
  })
}

export default router;