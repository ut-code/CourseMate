import type { InitRoom, SharedRoom, UserID } from "common/types";
import type {
  DMRoom,
  Message,
  MessageID,
  PersonalizedDMRoom,
  RoomOverview,
  SendMessage,
  ShareRoomID,
} from "common/types";
import { HTTPException } from "hono/http-exception";
import * as db from "../database/chat";
import { areAllMatched, getRelation } from "../database/matches";
import { getUserByID } from "../database/users";
import * as http from "./share/http";

export async function getOverview(
  id: number,
): Promise<http.Response<RoomOverview[]>> {
  try {
    const overview: RoomOverview[] = await db.getOverview(id);
    return {
      ok: true,
      code: 200,
      body: overview,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      code: 500,
      body: (err as Error).message,
    };
  }
}

export async function sendDM(
  from: UserID,
  to: UserID,
  send: SendMessage,
): Promise<Message> {
  const rel = await getRelation(from, to);
  if (rel.status === "REJECTED")
    throw new HTTPException(403, {
      message:
        "You cannot send a message because the friendship request was rejected.",
    });

  // they are now MATCHED
  const msg: Omit<Omit<Message, "id">, "isPicture"> = {
    creator: from,
    createdAt: new Date(),
    edited: false,
    ...send,
  };

  const result = await db.sendDM(rel.id, msg);
  if (!result)
    throw new HTTPException(500, { message: "Failed to send message" });
  return result;
}

export async function getDM(
  user: UserID,
  friend: UserID,
): Promise<http.Response<PersonalizedDMRoom & DMRoom>> {
  const rel = await getRelation(user, friend);
  if (rel.status === "REJECTED")
    return http.forbidden("cannot send to rejected-friend");

  const room = await db.getDMbetween(user, friend);

  const friendData = await getUserByID(friend);
  const unreadCount = db.unreadMessages(user, rel.id);

  const personalized: PersonalizedDMRoom & DMRoom = {
    unreadMessages: await unreadCount,
    friendId: friendData.id,
    name: friendData.name,
    thumbnail: friendData.pictureUrl,
    matchingStatus:
      rel.status === "MATCHED"
        ? "matched"
        : rel.sendingUserId === user //どっちが送ったリクエストなのかを判定
          ? "myRequest"
          : "otherRequest",
    ...room,
  };

  return http.ok(personalized);
}

export async function createRoom(
  creator: UserID,
  init: InitRoom,
): Promise<http.Response<SharedRoom>> {
  const allMatched = await areAllMatched(creator, init.members);
  if (!allMatched) return http.unauthorized("db error");

  if (!allMatched)
    return http.forbidden("some members are not matched with you");

  const room = await db.createSharedRoom(init);
  if (!room) return http.internalError("failed to create");

  return http.created(room);
}

export async function getRoom(
  user: UserID,
  roomId: ShareRoomID,
): Promise<http.Response<SharedRoom>> {
  if (!(await db.isUserInRoom(roomId, user)))
    return http.unauthorized("you don't belong to that room");
  const room = await db.getSharedRoom(roomId);
  return http.ok(room);
}

export async function patchRoom(
  user: UserID,
  roomId: ShareRoomID,
  newRoom: SharedRoom,
): Promise<http.Response<Omit<SharedRoom, "messages">>> {
  if (!(await db.isUserInRoom(roomId, user))) return http.forbidden();
  const room = await db.updateRoom(roomId, newRoom);
  return http.created(room);
}

export async function inviteUserToRoom(
  requester: UserID,
  invited: UserID[],
  roomId: ShareRoomID,
): Promise<http.Response<Omit<SharedRoom, "messages">>> {
  if (!(await areAllMatched(requester, invited)))
    return http.forbidden("some of the members are not friends with you");
  const room = await db.inviteUserToSharedRoom(roomId, invited);
  return http.ok(room);
}

export async function updateMessage(
  requester: UserID,
  messageId: MessageID,
  content: string,
): Promise<http.Response<Message>> {
  const old = await db.getMessage(messageId as MessageID);
  if (old.creator !== requester)
    return http.forbidden("cannot edit others' message");
  const msg = await db.updateMessage(messageId, content);
  return http.ok(msg);
}
