import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// uidからユーザー名を取得するエンドポイント
router.post("/myName", async (req, res) => {
  const { uid } = req.body;
  try {
    const userData = await prisma.user.findUnique({
      where: { uid: uid },
    });
    res.json({ myName: userData.name });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Failed to fetch username" });
  }
});
