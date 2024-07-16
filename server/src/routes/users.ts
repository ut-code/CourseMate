import express, { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
} from "../database/users";

const router = express.Router();

// 全ユーザーの取得エンドポイント
router.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ユーザーの取得エンドポイント
router.get("/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const user = await getUser(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      // パスワード以外の情報
      id: user.id,
      uid: user.uid,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ユーザーの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
  const { uid, name, email, password } = req.body;

  try {
    const newUser = await createUser({
      uid,
      name,
      email,
      password,
    });
    res.status(201).json({
      // パスワード以外の情報
      id: newUser.id,
      uid: newUser.uid,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ユーザーの更新エンドポイント
router.put("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, password } = req.body;

  const updateData: { name?: string; email?: string; password?: string } = {};
  if (email) updateData.email = email;
  if (name) updateData.name = name;
  if (password) updateData.password = password;

  // 更新する属性が一つも指定されていない場合はエラー
  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({ message: "No update fields provided" });
  }

  try {
    const updatedUser = await updateUser({
      userId: parseInt(userId),
      ...updateData,
    });
    res.status(200).json({
      // パスワード以外の情報
      id: updatedUser.id,
      uid: updatedUser.uid,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ユーザーの削除エンドポイント
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await deleteUser(parseInt(userId));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
