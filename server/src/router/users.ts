import type { GUID } from "common/types";
import {
  GUIDSchema,
  InitUserSchema,
  UpdateUserSchema,
  UserIDSchema,
} from "common/zod/schemas";
import { Hono } from "hono";
import { z } from "zod";
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
import { param } from "../lib/validator";

const router = new Hono()

  // 全ユーザーを取得
  .get("/", async (c) => {
    const result = await core.getAllUsers();
    c.status(result.code);
    return c.json(result.body);
  })

  .get("/recommended", async (c) => {
    const u = await getUserId(c);
    const recommended = await recommendedTo(u, 20, 0); // とりあえず 20 人
    return c.json(recommended.map((entry) => entry.u));
  })

  // 自分の情報を確認するエンドポイント。
  .get("/me", async (c) => {
    const guid = await getGUID(c);
    const result = await core.getUser(guid);
    c.status(result.code);
    return c.json(result.body);
  })

  // ユーザーの存在を確認するためのエンドポイント。だれでもアクセス可能
  .get("/exists/:guid", param({ guid: z.string() }), async (c) => {
    const guid = c.req.valid("param").guid;
    const ok = await core.userExists(guid as GUID);
    c.status(ok.code);
    return c.json({});
  })

  // 特定のユーザーとマッチしたユーザーを取得
  .get("/matched", async (c) => {
    const userId = await getUserId(c);
    const result = await core.getMatched(userId);
    c.status(result.code);
    return c.json(result.body);
  })

  // ユーザーにリクエストを送っているユーザーを取得 状態はPENDING
  .get("/pending/to-me", async (c) => {
    const userId = await getUserId(c);
    const sendingUsers = await getPendingRequestsToUser(userId);
    c.status(200);
    return c.json(sendingUsers);
  })

  // ユーザーがリクエストを送っているユーザーを取得 状態はPENDING
  .get("/pending/from-me", async (c) => {
    const userId = await getUserId(c);
    const receivers = await getPendingRequestsFromUser(userId);
    c.status(200);
    return c.json(receivers);
  })

  // guidでユーザーを取得
  .get("/guid/:guid", param({ guid: GUIDSchema }), async (c) => {
    const guid = c.req.valid("param").guid as GUID;
    const user = await getUser(guid);
    c.status(200);
    return c.json(user);
  })

  // idでユーザーを取得
  .get("/id/:id", param({ id: UserIDSchema }), async (c) => {
    const userId = c.req.valid("param").id;
    const user = await getUserByID(userId);
    c.status(200);
    return c.json(user);
  })

  // INSERT INTO "User" VALUES (body...)
  .post("/", async (c) => {
    const partialUser = InitUserSchema.parse(c.body);
    const user = await createUser(partialUser);

    //ユーザー作成と同時にメモとマッチング
    await matchWithMemo(user.id);
    c.status(201);
    return c.json(user);
  })

  // ユーザーの更新エンドポイント
  .put("/me", async (c) => {
    const id = await getUserId(c);
    const user = UpdateUserSchema.parse(c.body);
    const updated = await updateUser(id, user);
    c.status(200);
    return c.json(updated);
  })

  // ユーザーの削除エンドポイント
  .delete("/me", async (c) => {
    const id = await getUserId(c);
    await deleteUser(id);
    c.status(204);
    return c.json({});
  });

export default router;
