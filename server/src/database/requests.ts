import { PrismaClient, Relationship } from "@prisma/client";
import { UserID } from "../../../common/types";

const prisma = new PrismaClient();

// マッチリクエストの送信
export async function sendRequest({
  senderId,
  receiverId,
}: {
  senderId: UserID;
  receiverId: UserID;
}): Promise<Relationship> {
  // 既存の関係をチェック
  const existingRelationship = await prisma.relationship.findFirst({
    where: {
      OR: [
        { requestingUserId: senderId, requestedUserId: receiverId },
        { requestingUserId: receiverId, requestedUserId: senderId }, // 逆の関係もチェック
      ],
    },
  });
  // 既存の関係がある場合はそのまま返す
  if (existingRelationship) {
    return existingRelationship;
  }
  // 既存の関係がない場合は新しい関係を作成
  const newRelationship = await prisma.relationship.create({
    data: {
      requestingUser: { connect: { id: senderId } },
      requestedUser: { connect: { id: receiverId } },
      status: "PENDING",
    },
  });
  return newRelationship;
}

// 特定のユーザが送信・受信したマッチリクエストの取得
// TODO: make is less generic s.t. it is safer to use and easier to maintain
export async function getRequestsByUserId({
  senderId,
  receiverId,
}: {
  senderId?: UserID;
  receiverId?: UserID;
}): Promise<Relationship[]> {
  if (senderId === undefined && receiverId === undefined) {
    throw new Error("Either senderId or receiverId must be provided");
  }
  const whereClause: { requestingUserId?: UserID; requestedUserId?: UserID } =
    {};
  if (senderId !== undefined) {
    whereClause.requestingUserId = senderId;
  }
  if (receiverId !== undefined) {
    whereClause.requestedUserId = receiverId;
  }
  return await prisma.relationship.findMany({
    where: whereClause,
  });
}

// マッチリクエストの承認
export async function approveRequest(senderId: UserID, receiverId: UserID) {
  return await prisma.relationship.update({
    where: {
      requestingUserId_requestedUserId: {
        requestingUserId: senderId,
        requestedUserId: receiverId,
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
      requestingUserId_requestedUserId: {
        requestingUserId: senderId,
        requestedUserId: receiverId,
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
      requestingUsers: {
        some: {
          requestedUserId: userId,
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
//       where: {requestingUserId: userId}
//     });
//   } catch(error) {
//     console.log("failed to search requestingUsers")
//     throw error;
//   }
// }

//マッチした人の取得
export async function searchMatchedUser(userId: UserID) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          requestingUsers: {
            some: {
              requestedUserId: userId,
              status: "MATCHED",
            },
          },
        },
        {
          requestedUsers: {
            some: {
              requestingUserId: userId,
              status: "MATCHED",
            },
          },
        },
      ],
    },
  });
  return users;
}
