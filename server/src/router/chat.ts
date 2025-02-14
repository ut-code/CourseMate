import { panic } from "common/lib/panic";
import type { MessageID, UserID } from "common/types";
import { parseUserID } from "common/zod/methods";
import {
  ContentSchema,
  InitRoomSchema,
  SendMessageSchema,
  SharedRoomSchema,
} from "common/zod/schemas";
import express from "express";
import { z } from "zod";
import * as db from "../database/chat";
import { getRelation } from "../database/matches";
import { getUserId } from "../firebase/auth/db";
import * as core from "../functions/chat";
import * as ws from "../lib/socket/socket";

const router = express.Router();

router.get("/overview", async (req, res) => {
  const id = await getUserId(req);

  const result = await core.getOverview(id);
  res.status(result.code).send(result.body);
});

// send DM to userId.
router.post("/dm/to/:userid", async (req, res) => {
  const user = await getUserId(req);
  const friend =
    Number.parseInt(req.params.userid) ?? panic("bad param encoding: `userId`");
  const send = SendMessageSchema.parse(req.body);
  const result = await core.sendDM(user, friend, send);
  if (result.ok) {
    ws.sendMessage(result.body, friend);
  }
  res.status(result.code).send(result.body);
});

// GET a DM Room with userId, CREATE one if not found.
router.get("/dm/with/:userid", async (req, res) => {
  const user = await getUserId(req);
  const friend =
    Number.parseInt(req.params.userid) ??
    panic("invalid param `userId` formatting");
  const result = await core.getDM(user, friend);
  return res.status(result.code).send(result.body);
});

router.post("/mark-as-read/:rel/:messageId", async (req, res) => {
  const user = await getUserId(req);
  const message = Number.parseInt(req.params.messageId);
  const rel = Number.parseInt(req.params.rel);
  await db.markAsRead(rel, user, message);
  return res.status(200).end("ok");
});

// create a shared chat room.
router.post("/shared", async (req, res) => {
  const user = await getUserId(req);
  const init = InitRoomSchema.parse(req.body);
  const result = await core.createRoom(user, init);
  return res.status(result.code).send(result.body);
});

router.get("/shared/:roomId", async (req, res) => {
  const user = await getUserId(req);
  const roomId =
    Number.parseInt(req.params.roomId) ??
    panic("invalid formatting of :roomId");

  const result = await core.getRoom(user, roomId);
  return res.status(result.code).send(result.body);
});

/**
 * PATCH -> update room info. (except the message log).
 * - body: UpdateRoom
 **/
router.patch("/shared/:room", async (req, res) => {
  const user = await getUserId(req);
  const roomId =
    Number.parseInt(req.params.room) ?? panic("invalid param: room");
  const room = SharedRoomSchema.parse(req.body);
  const result = await core.patchRoom(user, roomId, room);
  res.status(result.code).send(result.body);
});

// POST: authorized body=UserID[]
router.post("/shared/id/:room/invite", async (req, res) => {
  const user = await getUserId(req);
  const roomId =
    Number.parseInt(req.params.room) ?? panic("invalid param: room");

  const invited = z.array(z.number()).parse(req.body);
  invited.map(parseUserID);

  const result = await core.inviteUserToRoom(user, invited, roomId);
  return res.status(result.code).send(result.body);
});

router.patch("/messages/id/:id", async (req, res) => {
  const user = await getUserId(req);
  const id = Number.parseInt(req.params.id) ?? panic("invalid param: id");
  const friend = z.number().parse(req.body.friend);

  const content = ContentSchema.parse(req.body.newMessage.content);

  const result = await core.updateMessage(user, id, content);
  res.status(result.code).send(result.body);
  if (result.ok) {
    ws.updateMessage(result.body, friend);
  }
});

router.delete("/messages/id/:id", async (req, res) => {
  const user = await getUserId(req);
  const id = Number.parseInt(req.params.id) ?? panic("invalid param: id");
  const friend = z.number().parse(req.body.friend);
  await db.deleteMessage(id as MessageID, user);
  ws.deleteMessage(id, friend);
  return res.status(204).send();
});

export default router;
