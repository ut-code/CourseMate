import { Err, Ok, type Result } from "common/lib/result";
import type { UserID } from "common/types";
import type {
  DMOverview,
  DMRoom,
  InitRoom,
  Message,
  MessageID,
  RelationshipID,
  RoomOverview,
  ShareRoomID,
  SharedRoom,
  SharedRoomOverview,
} from "common/types";
import { prisma } from "./client";
import { getRelation } from "./matches";
import { getMatchedUser, getPendingRequestsToUser } from "./requests";

export async function getOverview(
  user: UserID,
): Promise<Result<RoomOverview[]>> {
  try {
    const matched = await getMatchedUser(user);
    if (!matched.ok) return Err(matched.error);

    const requester = await getPendingRequestsToUser(user);
    if (!requester.ok) return Err(requester.error);

    const dm = await Promise.all(
      matched.value.map(async (friend) => {
        const lastMessageResult = await getLastMessage(user, friend.id);
        const lastMessage = lastMessageResult.ok
          ? lastMessageResult.value
          : undefined;
        const overview: DMOverview = {
          isDM: true,
          isFriend: true,
          friendId: friend.id,
          name: friend.name,
          thumbnail: friend.pictureUrl,
          lastMsg: lastMessage,
        };
        return overview;
      }),
    );

    const sharedRooms: {
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
    const shared = sharedRooms.map((room) => {
      const overview: SharedRoomOverview = {
        roomId: room.id as ShareRoomID,
        name: room.name,
        thumbnail: room.thumbnail,
        isDM: false,
      };
      return overview;
    });

    // リクエスター (友達申請者) のオーバービュー作成
    const requesterOverview = await Promise.all(
      requester.value.map(async (requester) => {
        const lastMessageResult = await getLastMessage(user, requester.id);
        const lastMessage = lastMessageResult.ok
          ? lastMessageResult.value
          : undefined;
        const overview: DMOverview = {
          isDM: true,
          isFriend: false,
          friendId: requester.id,
          name: requester.name,
          thumbnail: requester.pictureUrl,
          lastMsg: lastMessage,
        };
        return overview;
      }),
    );

    return Ok([...shared, ...dm, ...requesterOverview]);
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

export async function getLastMessage(
  userId: UserID,
  friendId: UserID,
): Promise<Result<Message>> {
  try {
    const rel = await getRelation(userId, friendId);
    if (!rel.ok) return Err("relation not found"); // relation not found
    const lastMessage = await prisma.message.findFirst({
      where: {
        relationId: rel.value.id,
      },
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    if (!lastMessage) return Err("last message not found");
    return Ok(lastMessage);
  } catch (e) {
    return Err(e);
  }
}
