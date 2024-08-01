import { doWithIdToken, ErrUnauthorized } from "../../firebase/auth/lib";
import endpoints from "../internal/endpoints";
import {
  DMRoom,
  InitRoom,
  Message,
  MessageID,
  RelationshipID,
  RoomOverview,
  SendMessage,
  SharedRoom,
  ShareRoomID,
  UpdateRoom,
  UserID,
} from "../../common/types";

/* TODO
import { UserID } from "../common/types";
import type { User } from "../common/types";
*/

export async function startDM(friendId: UserID): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmWith(friendId), {
      method: "POST",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `createDM() failed: expected status code 201, got ${res.status}`,
      );
  });
}

export async function createRoom(initRoom: InitRoom): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRooms, {
      method: "POST",
      body: JSON.stringify(initRoom),
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `in createRoom(), expected res status to equal 201, but instead got ${res.status}`,
      );
  });
}

export async function invite(
  roomId: ShareRoomID,
  memberIDs: UserID[],
): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.roomInvite(roomId), {
      method: "POST",
      body: JSON.stringify(memberIDs),
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
  });
}

export async function patchRoom(
  roomId: ShareRoomID,
  room: Partial<UpdateRoom>,
): Promise<SharedRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      method: "PATCH",
      body: JSON.stringify(room),
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 200)
      throw new Error(
        `in patchRoom(), expected status code 200 but got ${res.status}`,
      );
    return await res.json();
  });
}

export async function overview(): Promise<RoomOverview[]> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.roomOverview, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    return await res.json();
  });
}

export async function rooms(): Promise<RoomOverview[]> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRooms, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    return await res.json();
  });
}

export async function getSharedRoom(roomId: ShareRoomID): Promise<SharedRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      credentials: "include",
    });
    if (res.status === 404) throw new ErrUnauthorized();
    return await res.json();
  });
}

export async function getDM(id: RelationshipID): Promise<DMRoom> {
  return doWithIdToken(async () => {
    const res = await fetch(endpoints.dmWith(id), {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 200)
      throw new Error(
        `assertion failed on getDM: expected 200 on res.status, but got ${res.status}`,
      );
    return res.json();
  });
}

// don't forget to refresh after sending.
export async function send(
  roomId: ShareRoomID,
  msg: SendMessage,
): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(msg),
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `on send(), expected status code of 201, but got ${res.status}`,
      );
  });
}

// TODO
export async function sendDM(
  friend: UserID,
  msg: SendMessage,
): Promise<Message> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmTo(friend), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(msg),
    });
    return res.json();
  });
}

export async function startDMWith(userId: UserID): Promise<DMRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmWith(userId), {
      method: "PUT",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status === 200 || res.status === 201) return res.json();
    throw new Error(
      `on send(), expected status code of 200 or 201, but got ${res.status}`,
    );
  });
}

export async function deleteMessage(messageId: MessageID): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.message(messageId), {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 204)
      throw new Error(
        `on deleteMessage(), expected status code of 204, but got ${res.status}`,
      );
  });
}
