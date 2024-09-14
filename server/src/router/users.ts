import express, { Request, Response } from "express";
import { PublicUser, UpdateUser, GUID } from "../common/types";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getUserByID,
} from "../database/users";
import {
  getPendingRequestsFromUser,
  getPendingRequestsToUser,
} from "../database/requests";
import { safeGetUserId } from "../firebase/auth/db";
import { safeGetGUID } from "../firebase/auth/lib";
import { parseUpdateUser } from "../common/zod/methods";
import * as core from "../functions/user";
import { Public } from "../functions/user";
import { GUIDSchema, InitUserSchema } from "../common/zod/schemas";

const router = express.Router();

// 全ユーザーを取得
router.get("/", async (_: Request, res: Response) => {
  const result = await core.getAllUsers();
  res.status(result.code).send(result.body);
});

// 自分の情報を確認するエンドポイント。
router.get("/me", async (req: Request, res: Response) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send("auth error");

  const result = await core.getUser(guid.value);
  res.status(result.code).send(result.body);
});

// ユーザーの存在を確認するためのエンドポイント。だれでもアクセス可能
router.get("/exists/:guid", async (req: Request, res: Response) => {
  const guid = req.params.guid;
  const ok = await core.userExists(guid as GUID);
  res.status(ok ? 200 : 404).send();
});

// 特定のユーザーとマッチしたユーザーを取得
router.get("/matched", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  const result = await core.getMatched(userId.value);
  res.status(result.code).json(result.body);
});

// ユーザーにリクエストを送っているユーザーを取得 状態はPENDING
router.get("/pending/to-me", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  const sendingUsers = await getPendingRequestsToUser(userId.value);
  if (!sendingUsers.ok) {
    console.log(sendingUsers.error);
    return res.status(500).send();
  }
  const safeUsers = sendingUsers.value.map(Public);
  res.status(200).json(safeUsers);
});

// ユーザーがリクエストを送っているユーザーを取得 状態はPENDING
router.get("/pending/from-me", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  const receivers = await getPendingRequestsFromUser(userId.value);
  if (!receivers.ok) {
    console.log(receivers.error);
    return res.status(500).send();
  }
  const safeUsers = receivers.value.map(Public);
  res.status(200).json(safeUsers);
});

// guidで Public にユーザーを取得
router.get("/guid/:guid", async (req: Request, res: Response) => {
  const guid_ = GUIDSchema.safeParse(req.params.guid);
  if (!guid_.success) return res.status(400).send();
  const guid = guid_.data;

  const user = await getUser(guid as GUID);
  if (!user.ok) {
    return res.status(404).json({ error: "User not found" });
  }
  const json: PublicUser = Public(user.value);
  res.status(200).json(json);
});

// GET Public(*) FROM "User" WHERE id = ?
router.get("/id/:id", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);
  const user = await getUserByID(userId.value);
  if (!user.ok) {
    return res.status(404).json({ error: "User not found" });
  }
  const json: PublicUser = Public(user.value);
  res.status(200).json(json);
});

// INSERT INTO "User" VALUES (body...)
router.post("/", async (req: Request, res: Response) => {
  const partialUser = InitUserSchema.safeParse(req.body);
  if (!partialUser.success) return res.status(400).send("invalid format");

  const user = await createUser(partialUser.data);
  if (!user.ok) return res.status(500).send();
  res.status(201).json(user.value);
});

// ユーザーの更新エンドポイント
router.put("/me", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  const user: UpdateUser = req.body;
  try {
    parseUpdateUser(user);
  } catch (e) {
    return res.status(400).send("invalid format");
  }
  const updated = await updateUser(id.value, user);
  if (!updated.ok) return res.status(500).send();
  res.status(200).json(updated.value);
});

// ユーザーの削除エンドポイント
router.delete("/me", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  const deleted = await deleteUser(id.value);
  if (!deleted.ok) return res.status(500).send();
  res.status(204).send();
});

export default router;
