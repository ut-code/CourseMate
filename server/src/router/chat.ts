import type { MessageID } from "common/types";
import { parseUserID } from "common/zod/methods";
import {
  ContentSchema,
  InitRoomSchema,
  SendMessageSchema,
  SharedRoomSchema,
} from "common/zod/schemas";
import { Hono } from "hono";
import { z } from "zod";
import * as db from "../database/chat";
import { getUserId } from "../firebase/auth/db";
import * as core from "../functions/chat";
import * as ws from "../lib/socket/socket";
import { json, param } from "../lib/validator";

const userid_param = param({ userid: z.number() });
const router = new Hono()
  .get("/overview", async (c) => {
    const id = await getUserId(c);
    const result = await core.getOverview(id);
    return c.json(result.body); // status: result.code
  })

  // send DM to userId.
  .post("/dm/to/:userid", userid_param, json(SendMessageSchema), async (c) => {
    const user = await getUserId(c);
    const friend = c.req.valid("param").userid;
    const send = c.req.valid("json");
    const result = await core.sendDM(user, friend, send);
    if (result.ok) {
      ws.sendMessage(result.body, friend);
    }
    return c.json(result.body); // status: result.code
  })

  // GET a DM Room with userId, CREATE one if not found.
  .get("/dm/with/:userid", userid_param, async (c) => {
    const user = await getUserId(c);
    const friend = c.req.valid("param").userid;
    const result = await core.getDM(user, friend);
    return c.json(result.body); // status: result.code
  })

  .post(
    "/mark-as-read/:rel/:messageId",
    param({ messageId: z.coerce.number(), rel: z.coerce.number() }),
    async (c) => {
      const user = await getUserId(c);
      const { messageId, rel } = c.req.valid("param");
      await db.markAsRead(rel, user, messageId);
      return c.text("ok");
    },
  )

  // create a shared chat room.
  .post("/shared", json(InitRoomSchema), async (c) => {
    const user = await getUserId(c);
    const init = c.req.valid("json");
    const result = await core.createRoom(user, init);
    c.status(result.code);
    return c.json(result.body);
  })

  .get("/shared/:roomId", param({ roomId: z.coerce.number() }), async (c) => {
    const user = await getUserId(c);
    const roomId = c.req.valid("param").roomId;
    const result = await core.getRoom(user, roomId);
    return c.json(result.body);
  })

  /**
   * PATCH -> update room info. (except the message log).
   * - body: UpdateRoom
   **/
  .patch(
    "/shared/:room",
    param({ room: z.coerce.number() }),
    json(SharedRoomSchema),
    async (c) => {
      const user = await getUserId(c);
      const roomId = c.req.valid("param").room;
      const room = c.req.valid("json");
      const result = await core.patchRoom(user, roomId, room);
      c.status(result.code);
      return c.json(result.body);
    },
  )

  // POST: authorized body=UserID[]
  .post("/shared/id/:room/invite", param({ room: z.number() }), async (c) => {
    const user = await getUserId(c);
    const roomId = c.req.valid("param").room;

    const invited = z.array(z.number()).parse(c.body);
    invited.map(parseUserID);

    const result = await core.inviteUserToRoom(user, invited, roomId);
    c.status(result.code);
    return c.json(result.body);
  })

  .patch(
    "/messages/id/:id",
    param({ id: z.coerce.number() }),
    json(
      z.object({
        friend: z.number(),
        newMessage: z.object({ content: ContentSchema }),
      }),
    ),
    async (c) => {
      const user = await getUserId(c);
      const id = c.req.valid("param").id;
      const friend = c.req.valid("json").friend;

      const content = c.req.valid("json").newMessage.content;

      const result = await core.updateMessage(user, id, content);
      if (result.ok) {
        ws.updateMessage(result.body, friend);
      }
      c.status(result.code);
      return c.json(result.body);
    },
  )

  .delete(
    "/messages/id/:id",
    param({ id: z.coerce.number() }),
    json(z.object({ friend: z.number() })),
    async (c) => {
      const user = await getUserId(c);
      const id = c.req.valid("param").id;
      const friend = c.req.valid("json").friend;
      await db.deleteMessage(id as MessageID, user);
      ws.deleteMessage(id, friend);
      c.status(204);
      return c.json({});
    },
  );

export default router;
