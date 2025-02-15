import type { GUID } from "common/types";
import type { User } from "common/types";
import {
  GUIDSchema,
  InitUserSchema,
  UpdateUserSchema,
} from "common/zod/schemas";
import express, { type Request, type Response } from "express";
import {
  getPendingRequestsFromUser,
  getPendingRequestsToUser,
  matchWithMemo,
} from "../database/requests";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByID,
  updateUser,
} from "../database/users";
import { getUserId } from "../firebase/auth/db";
import { getGUID } from "../firebase/auth/lib";
import { recommendedTo } from "../functions/engines/recommendation";
import * as core from "../functions/user";

const router = express.Router();

// 全ユーザーを取得
router.get("/", async (_: Request, res: Response) => {
  const result = await core.getAllUsers();
  res.status(result.code).send(result.body);
});

router.get("/recommended", async (req, res) => {
  const u = await getUserId(req);
  const recommended = await recommendedTo(u, 20, 0); // とりあえず 20 人
  res.send(recommended.map((entry) => entry.u));
});

// 自分の情報を確認するエンドポイント。
router.get("/me", async (req: Request, res: Response) => {
  const guid = await getGUID(req);
  const result = await core.getUser(guid);
  res.status(result.code).send(result.body);
});

// ユーザーの存在を確認するためのエンドポイント。だれでもアクセス可能
router.get("/exists/:guid", async (req: Request, res: Response) => {
  const guid = req.params.guid;
  const ok = await core.userExists(guid as GUID);
  res.status(ok.code).send();
});

// 特定のユーザーとマッチしたユーザーを取得
router.get("/matched", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const result = await core.getMatched(userId);
  res.status(result.code).json(result.body);
});

// ユーザーにリクエストを送っているユーザーを取得 状態はPENDING
router.get("/pending/to-me", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const sendingUsers = await getPendingRequestsToUser(userId);
  res.status(200).json(sendingUsers);
});

// ユーザーがリクエストを送っているユーザーを取得 状態はPENDING
router.get("/pending/from-me", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const receivers = await getPendingRequestsFromUser(userId);
  res.status(200).json(receivers);
});

// guidでユーザーを取得
router.get("/guid/:guid", async (req: Request, res: Response) => {
  const guid_ = GUIDSchema.safeParse(req.params.guid);
  if (!guid_.success) return res.status(400).send();
  const guid = guid_.data;

  const user = await getUser(guid as GUID);
  res.status(200).json(user);
});

// idでユーザーを取得
router.get("/id/:id", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const user = await getUserByID(userId);
  const json: User = user;
  res.status(200).json(json);
});

// INSERT INTO "User" VALUES (body...)
router.post("/", async (req: Request, res: Response) => {
  const partialUser = InitUserSchema.parse(req.body);
  const user = await createUser(partialUser);

  //ユーザー作成と同時にメモとマッチング
  await matchWithMemo(user.id);
  res.status(201).json(user);
});

// ユーザーの更新エンドポイント
router.put("/me", async (req: Request, res: Response) => {
  const id = await getUserId(req);
  const user = UpdateUserSchema.parse(req.body);
  const updated = await updateUser(id, user);
  res.status(200).json(updated);
});

// ユーザーの削除エンドポイント
router.delete("/me", async (req, res) => {
  const id = await getUserId(req);
  const deleted = await deleteUser(id);
  res.status(204).send();
});

export default router;
