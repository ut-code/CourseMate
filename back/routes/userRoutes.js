// userRoutes.js

import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// ユーザーの取得（全ユーザーの取得）
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ユーザーの取得（特定のユーザーの取得）
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ユーザーの作成エンドポイント
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    });
    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ユーザーの更新エンドポイント
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { name, email }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ユーザーの削除エンドポイント
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(userId) }
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
