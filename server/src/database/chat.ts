import { PrismaClient } from "@prisma/client";
import { UserID, Relationship } from "../common/types";
import type { RoomOverview } from "../common/types";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function Overview(user: UserID): Promise<RoomOverview[]> {
  const dms = await prisma.dm.findMany({
    where: {
      member: {
        has: user,
      },
    },
  });
  const shared = await prisma.sharedroom.findMany({
    where: {
      member: {
        has: user,
      },
    },
  });
  return dms.concat(shared);
}

// DM Room の作成
export async function createDMRoom({
  creatorId,
  friendId,
}: {
  creatorId: UserID;
  friendId: UserID;
}): Promise<DMRoom> {
  // 既存の関係がない場合は新しい関係を作成
  const newRelationship = await prisma.dm.create({
    data: {
      members: [creatorId, friendId],
      messages: [],
    },
  });
  return newRelationship;
}


// マッチリクエストの承認
export async function approveRequest(senderId: UserID, receiverId: UserID) {
  return await prisma.relationship.update({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: senderId,
        receivingUserId: receiverId,
      },
    },
    data: {
      status: "MATCHED",
    },
  });
}

// マッチリクエストの拒否
export async function rejectRequest(senderId: UserID, receiverId: UserID) {
  return await prisma.relationship.update({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: senderId,
        receivingUserId: receiverId,
      },
    },
    data: {
      status: "REJECTED",
    },
  });
}

//ユーザーにまつわるリクエストを探す
export async function searchPendingUsers(userId: UserID) {
  //俺をリクエストしているのは誰だ
  return await prisma.user.findMany({
    where: {
      sendingUsers: {
        some: {
          receivingUserId: userId,
          status: "PENDING",
        },
      },
    },
  });
}

// export async function searchRequestingUser(userId: UserID):Promise<Relationship[]> {
//   //俺がリクエストしているのは誰だ
//   try {
//     return await prisma.relationship.findMany({
//       where: {sendingUserId: userId}
//     });
//   } catch(error) {
//     console.log("failed to search sendingUsers")
//     throw error;
//   }
// }

//マッチした人の取得
export async function searchMatchedUser(userId: UserID) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          sendingUsers: {
            some: {
              receivingUserId: userId,
              status: "MATCHED",
            },
          },
        },
        {
          receivingUsers: {
            some: {
              sendingUserId: userId,
              status: "MATCHED",
            },
          },
        },
      ],
    },
  });
  return users;
}
