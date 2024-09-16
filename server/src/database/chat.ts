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
import { getRelation } from "./matches";
import { getMatchedUser } from "./requests";
import { Err, Ok, Result } from "../common/lib/result";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function getOverview(
  user: UserID,
): Promise<Result<RoomOverview[]>> {
  try {
    const matched = await getMatchedUser(user);
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
): Promise<Result<Message>> {
  try {
    const message = await prisma.message.create({
      data: {
        relationId: relation,
        ...content,
      },
    });
    return Ok(message);
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
): Promise<Result<boolean>> {
  try {
    const room = await prisma.sharedRoom.findUnique({
      where: {
        id: roomId,
        members: {
          has: userId,
        },
      },
    });

    return Ok(room !== null);
  } catch (e) {
    return Err(e);
  }
}

export async function updateRoom(
  roomId: ShareRoomID,
  newRoom: Partial<Omit<SharedRoom, "messages">>,
): Promise<Result<Omit<SharedRoom, "messages">>> {
  try {
    type UpdatedRoom = Omit<Omit<SharedRoom, "isDM">, "messages">;
    const updated: UpdatedRoom = await prisma.sharedRoom.update({
      where: {
        id: roomId,
      },
      data: newRoom,
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

export async function getDMbetween(
  u1: UserID,
  u2: UserID,
): Promise<Result<DMRoom>> {
  try {
    const rel = await getRelation(u1, u2);
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
      orderBy: {
        createdAt: "asc",
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

export async function getSharedRoom(
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

export async function getMessage(id: MessageID): Promise<Result<Message>> {
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

export async function deleteMessage(
  id: MessageID,
  creatorId: UserID | undefined,
): Promise<Message | null> {
  try {
    const message = await prisma.message.delete({
      where: {
        id: id,
        creator: creatorId,
      },
    });
    return message;
  } catch (e) {
    return null;
  }
}
