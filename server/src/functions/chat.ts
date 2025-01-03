import type { Result } from "common/lib/result";
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
import * as db from "../database/chat";
import { areAllMatched, getRelation } from "../database/matches";
import { getUserByID } from "../database/users";
import * as http from "./share/http";

export async function getOverview(
  id: number,
): Promise<http.Response<RoomOverview[]>> {
  const overview: Result<RoomOverview[]> = await db.getOverview(id);
  if (!overview.ok) {
    console.error(overview.error);
    return {
      ok: false,
      code: 500,
      body: overview.error as string,
    };
  }

  return {
    ok: true,
    code: 200,
    body: overview.value,
  };
  // SEND: RoomOverview[].
  // this is NOT ordered. you need to sort it on frontend.
}

export async function sendDM(
  from: UserID,
  to: UserID,
  send: SendMessage,
): Promise<http.Response<Message>> {
  const rel = await getRelation(from, to);
  if (!rel.ok || rel.value.status === "REJECTED")
    return http.forbidden(
      "You cannot send a message because the friendship request was rejected.",
    );

  // they are now MATCHED
  const msg: Omit<Omit<Message, "id">, "isPicture"> = {
    creator: from,
    createdAt: new Date(),
    edited: false,
    ...send,
  };

  const result = await db.sendDM(rel.value.id, msg);
  if (!result.ok) return http.internalError("Failed to send DM");
  return http.created(result.value);
}

export async function getDM(
  user: UserID,
  friend: UserID,
): Promise<http.Response<PersonalizedDMRoom & DMRoom>> {
  const rel = await getRelation(user, friend);
  if (!rel.ok || rel.value.status === "REJECTED")
    return http.forbidden("cannot send to rejected-friend");

  const room = await db.getDMbetween(user, friend);
  if (!room.ok) return http.internalError();

  const friendData = await getUserByID(friend);
  if (!friendData.ok) return http.notFound("friend not found");
  const unreadCount = db.unreadMessages(user, rel.value.id).then((val) => {
    if (val.ok) return val.value;
    throw val.error;
  });

  const personalized: PersonalizedDMRoom & DMRoom = {
    unreadMessages: await unreadCount,
    friendId: friendData.value.id,
    name: friendData.value.name,
    thumbnail: friendData.value.pictureUrl,
    matchingStatus:
      rel.value.status === "MATCHED"
        ? "matched"
        : rel.value.sendingUserId === user //どっちが送ったリクエストなのかを判定
          ? "myRequest"
          : "otherRequest",
    ...room.value,
  };

  return http.ok(personalized);
}

export async function createRoom(
  creator: UserID,
  init: InitRoom,
): Promise<http.Response<SharedRoom>> {
  const allMatched = await areAllMatched(creator, init.members);
  if (!allMatched.ok) return http.unauthorized("db error");

  if (!allMatched.value)
    return http.forbidden("some members are not matched with you");

  const room = await db.createSharedRoom(init);
  if (!room.ok) return http.internalError("failed to create");

  return http.created(room.value);
}

export async function getRoom(
  user: UserID,
  roomId: ShareRoomID,
): Promise<http.Response<SharedRoom>> {
  const userInRoom = await db.isUserInRoom(roomId, user);

  if (!userInRoom.ok) return http.internalError("db error");
  if (!userInRoom.value)
    return http.unauthorized("you don't belong to that room");

  const room = await db.getSharedRoom(roomId);
  if (!room.ok) return http.internalError();
  if (!room.value) return http.notFound();

  return http.ok(room.value);
}

export async function patchRoom(
  user: UserID,
  roomId: ShareRoomID,
  newRoom: SharedRoom,
): Promise<http.Response<Omit<SharedRoom, "messages">>> {
  if (!(await db.isUserInRoom(roomId, user))) return http.forbidden();

  const room = await db.updateRoom(roomId, newRoom);
  if (!room.ok) return http.internalError();

  return http.created(room.value);
}

export async function inviteUserToRoom(
  requester: UserID,
  invited: UserID[],
  roomId: ShareRoomID,
): Promise<http.Response<Omit<SharedRoom, "messages">>> {
  if (!(await areAllMatched(requester, invited)))
    return http.forbidden("some of the members are not friends with you");

  const room = await db.inviteUserToSharedRoom(roomId, invited);

  if (!room.ok) return http.internalError();

  return http.ok(room.value);
}

export async function updateMessage(
  requester: UserID,
  messageId: MessageID,
  content: string,
): Promise<http.Response<Message>> {
  const old = await db.getMessage(messageId as MessageID);
  if (!old.ok) return http.notFound("couldn't find message");
  if (old.value.creator !== requester)
    return http.forbidden("cannot edit others' message");

  const msg = await db.updateMessage(messageId, content);
  if (!msg.ok) return http.internalError();

  return http.ok(msg.value);
}
