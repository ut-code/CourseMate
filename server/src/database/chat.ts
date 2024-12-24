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
import {
  getMatchedUser,
  getPendingRequestsFromUser,
  getPendingRequestsToUser,
} from "./requests";
import { getUserByID } from "./users";

export async function getOverview(
  user: UserID,
): Promise<Result<RoomOverview[]>> {
  try {
    const matched = await getMatchedUser(user);
    if (!matched.ok) return Err(matched.error);

    const senders = await getPendingRequestsToUser(user);
    if (!senders.ok) return Err(senders.error);

    const receivers = await getPendingRequestsFromUser(user);
    if (!receivers.ok) return Err(receivers.error);

    //マッチングしている人のオーバービュー
    const matchingOverview = await Promise.all(
      matched.value.map(async (m) => getOverviewBetween(user, m.id)),
    );

    //自分にリクエストを送ってきた人のオーバービュー
    const senderOverview = await Promise.all(
      senders.value.map((s) => getOverviewBetween(user, s.id)),
    );

    //自分がリクエストを送った人のオーバービュー
    const receiverOverview = await Promise.all(
      receivers.value.map((r) => getOverviewBetween(user, r.id)),
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

    const overview = [
      ...matchingOverview,
      ...senderOverview,
      ...receiverOverview,
      ...shared,
    ];

    const sortedOverviewByTime = overview.sort((a, b) => {
      const dateA = a.lastMsg?.createdAt ? a.lastMsg.createdAt.getTime() : 0;
      const dateB = b.lastMsg?.createdAt ? b.lastMsg.createdAt.getTime() : 0;
      return dateB - dateA;
    });

    return Ok([...sortedOverviewByTime]);
  } catch (e) {
    return Err(e);
  }
}

async function getOverviewBetween(
  user: number,
  other: number,
): Promise<DMOverview> {
  const relR = await getRelation(user, other);
  if (!relR.ok) throw relR.error;
  const rel = relR.value;

  const friendId =
    rel.receivingUserId === user ? rel.sendingUserId : rel.receivingUserId;
  const lastMessage = getLastMessage(user, friendId).then((val) => {
    if (val.ok) return val.value;
    return undefined;
  });
  const unreadCount = unreadMessages(user, rel.id).then((val) => {
    if (val.ok) return val.value;
    throw val.error;
  });
  const friend = await getUserByID(friendId).then((val) => {
    if (val.ok) return val.value;
    throw val.error;
  });
  const overview: DMOverview = {
    isDM: true,
    matchingStatus: "matched",
    friendId: friendId,
    name: friend.name,
    thumbnail: friend.pictureUrl,
    lastMsg: await lastMessage,
    unreadMessages: await unreadCount,
  };
  return overview;
}
export async function markAsRead(
  rel: RelationshipID,
  reader: UserID,
  message: MessageID,
) {
  const val = {
    readerId: reader,
    messageId: message,
    relationId: rel,
  };
  return await prisma.message.updateMany({
    where: {
      id: {
        lte: message,
      },
      relationId: rel,
      creator: {
        not: {
          equals: reader,
        },
      },
    },
    data: {
      read: true,
    },
  });
}

/**
 * DM の送信
 * 送信者の id は呼び出す側で指定すること
 **/
export async function sendDM(
  relation: RelationshipID,
  content: Omit<Omit<Message, "id">, "isPicture">,
): Promise<Result<Message>> {
  try {
    const message = await prisma.message.create({
      data: {
        relationId: relation,
        isPicture: false,
        read: false,
        ...content,
      },
    });
    return Ok(message);
  } catch (e) {
    return Err(e);
  }
}
/**
this doesn't create the image. use uploadPic in database/picture.ts to create the image.
**/
export async function createImageMessage(
  sender: UserID,
  relation: RelationshipID,
  url: string,
) {
  return prisma.message
    .create({
      data: {
        creator: sender,
        relationId: relation,
        content: url,
        isPicture: true,
      },
    })
    .then((val) => Ok(val))
    .catch((err) => Err(err));
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

// only works on Relationship (= DM) for now.
export async function unreadMessages(userId: UserID, roomId: RelationshipID) {
  try {
    // FIXME: this makes request twice to the database. it's not efficient.
    const unreadMessages = await prisma.message.count({
      where: {
        read: false,
        relationId: roomId,
        creator: {
          not: {
            equals: userId,
          },
        },
      },
    });
    return Ok(unreadMessages);
  } catch (e) {
    return Err(e);
  }
}
