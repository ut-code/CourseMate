import { PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";
import type {
  RoomOverview,
  RelationshipID,
  DMRoom,
  InitRoom,
  SharedRoom,
  ShareRoomID,
  Message,
  MessageID,
  DMOverview,
  SharedRoomOverview,
} from "../common/types";
import { findRelation } from "./matches";
import { searchMatchedUser } from "./requests";
import { Err, Ok, Result } from "../common/lib/result";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function overview(user: UserID): Promise<Result<RoomOverview[]>> {
  try {
    const matched = await searchMatchedUser(user);
    if (!matched.ok) return Err(matched.error);
    const dmov = matched.value.map((user) => {
      const ov: DMOverview = {
        isDM: true,
        friendId: user.id,
        name: user.name,
        thumbnail: user.pictureUrl,
      };
      return ov;
    });

    const shared: {
      id: number;
      name: string;
      thumbnail: string;
    }[] = await prisma.sharedRoom.findMany({
      where: {
        members: {
          has: user,
        },
      },
    });
    const sharedov = shared.map((shared) => {
      const overview: SharedRoomOverview = {
        roomId: shared.id as ShareRoomID,
        name: shared.name,
        thumbnail: shared.thumbnail,
        isDM: false,
      };
      return overview;
    });
    return Ok([...sharedov, ...dmov]);
  } catch (e) {
    return Err(e);
  }
}

/**
 * DM の送信
 * 送信者の id は呼び出す側で指定すること
 **/
export async function sendDM(
  relation: RelationshipID,
  content: Omit<Message, "id">,
): Promise<Result<void>> {
  try {
    await prisma.message.create({
      data: {
        relationId: relation,
        ...content,
      },
    });
    return Ok(undefined);
  } catch (e) {
    return Err(e);
  }
}

export async function createSharedRoom(
  room: InitRoom,
): Promise<Result<SharedRoom>> {
  try {
    type CreateRoom = Omit<Omit<SharedRoom, "isDM">, "messages">;
    const created: CreateRoom = await prisma.sharedRoom.create({
      data: {
        thumbnail: "todo",
        name: room.name,
        members: room.members,
      },
    });
    return Ok({
      isDM: false,
      messages: [],
      ...created,
    });
  } catch (e) {
    return Err(e);
  }
}

export async function isUserInRoom(
  roomId: ShareRoomID,
  userId: UserID,
): Promise<boolean> {
  try {
    const room = await prisma.sharedRoom.findUnique({
      where: {
        id: roomId,
        members: {
          has: userId,
        },
      },
    });

    return room !== null;
  } catch (_) {
    return false;
  }
}

export async function updateRoomName(
  roomId: ShareRoomID,
  newName: string,
): Promise<Result<Omit<SharedRoom, "messages">>> {
  try {
    type UpdatedRoom = Omit<Omit<SharedRoom, "isDM">, "messages">;
    const updated: UpdatedRoom = await prisma.sharedRoom.update({
      where: {
        id: roomId,
      },
      data: {
        name: newName,
      },
    });
    return Ok({
      isDM: false,
      ...updated,
    });
  } catch (e) {
    return Err(e);
  }
}

export async function inviteUserToSharedRoom(
  roomId: ShareRoomID,
  invite: UserID[],
): Promise<Result<Omit<SharedRoom, "messages">>> {
  try {
    const update = await prisma.sharedRoom.update({
      where: {
        id: roomId,
      },
      data: {
        members: {
          push: invite,
        },
      },
    });
    return Ok({
      isDM: false,
      ...update,
    });
  } catch (e) {
    return Err(e);
  }
}

export async function findDMbetween(
  u1: UserID,
  u2: UserID,
): Promise<Result<DMRoom>> {
  try {
    const rel = await findRelation(u1, u2);
    if (!rel.ok) return Err("room not found");

    return await findDM(rel.value.id);
  } catch (e) {
    return Err(e);
  }
}
export async function findDM(relID: RelationshipID): Promise<Result<DMRoom>> {
  try {
    const messages: Message[] = await prisma.message.findMany({
      where: {
        relationId: relID,
      },
    });

    return Ok({
      isDM: true,
      id: relID,
      messages: messages,
    });
  } catch (e) {
    return Err(e);
  }
}

export async function findSharedRoom(
  roomId: ShareRoomID,
): Promise<Result<SharedRoom | null>> {
  try {
    const room = await prisma.sharedRoom.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room) return Err("room not found");

    const messages = await prisma.message.findMany({
      where: {
        sharedRoomId: room.id,
      },
    });
    return Ok({
      isDM: false,
      messages: messages,
      ...room,
    });
  } catch (e) {
    return Err(e);
  }
}

export async function findMessage(id: MessageID): Promise<Result<Message>> {
  try {
    const message = await prisma.message.findUnique({
      where: {
        id: id,
      },
    });
    if (!message) return Err("message not found");
    return Ok(message);
  } catch (e) {
    return Err(e);
  }
}

export async function updateMessage(
  id: MessageID,
  content: string,
): Promise<Result<Message>> {
  try {
    const message = await prisma.message.update({
      where: {
        id: id,
      },
      data: {
        content: content,
        edited: true,
      },
    });
    return Ok(message);
  } catch (e) {
    return Err(e);
  }
}
