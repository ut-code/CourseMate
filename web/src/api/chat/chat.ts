import { doWithIdToken, ErrUnauthorized } from "../../firebase/auth/lib";
import endpoints from "../internal/endpoints";
import {
  DMRoom,
  InitRoom,
  // Message,
  MessageID,
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

//// DM グループチャット 共通////

//指定したメッセージを削除する
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

export async function updateMessage(
  messageId: MessageID,
  to: SendMessage,
): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.message(messageId), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to),
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 200)
      throw new Error(
        `on updateMessage(), expected status code of 200, but got ${res.status}`,
      );
  });
}

// 自身の参加しているすべての Room (DM グループチャットともに) の概要 (Overview) の取得 (メッセージの履歴を除く)
export async function overview(): Promise<RoomOverview[]> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.roomOverview, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    return await res.json();
  });
}

//// DM関連 ////

// TODO
// 指定したユーザーにDMを送る
export async function sendDM(friend: UserID, msg: SendMessage): Promise<void> {
  return await doWithIdToken(async () => {
    await fetch(endpoints.dmTo(friend), {
      method: "POST",
      credentials: "include",
      headers: {
        // didn't think I need this
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
  });
}

// 相手のIDを指定して、
export async function getDM(friendId: UserID): Promise<DMRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmWith(friendId), {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `createDM() failed: expected status code 201, got ${res.status}`,
      );
    return res.json();
  });
}

////グループチャット関連////

// グループチャットを作成する←今使わない
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

// グループチャットにメンバーを招待する
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

// グループチャットの情報を更新する
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

// TODO getのエンドポイントがない

// export async function rooms(): Promise<RoomOverview[]> {
//   return await doWithIdToken(async () => {
//     const res = await fetch(endpoints.sharedRooms, {
//       credentials: "include",
//     });
//     if (res.status === 401) throw new ErrUnauthorized();
//     return await res.json();
//   });
// }

//指定したグループチャットの部屋情報を得る
export async function getSharedRoom(roomId: ShareRoomID): Promise<SharedRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      credentials: "include",
    });
    if (res.status === 404) throw new ErrUnauthorized();
    return await res.json();
  });
}

// don't forget to refresh after sending.
// グループチャットでメッセージを送信する
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
