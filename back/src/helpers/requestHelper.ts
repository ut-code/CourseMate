import { PrismaClient, Relationship } from "@prisma/client";

const prisma = new PrismaClient();

// マッチリクエストの送信
export async function sendRequest({
  senderId,
  receiverId,
}: {
  senderId: number;
  receiverId: number;
}) {
  return await prisma.relationship.create({
    data: {
      requestingUser: { connect: { id: senderId } },
      requestedUser: { connect: { id: receiverId } },
      status: "PENDING",
    },
  });
}

// 特定のユーザが送信・受信したマッチリクエストの取得
export async function getRequestsByUserId({
  senderId,
  receiverId,
}: {
  senderId?: number;
  receiverId?: number;
}) {
  if (senderId === undefined && receiverId === undefined) {
    throw new Error("Either senderId or receiverId must be provided");
  }
  const whereClause: { requestingUserId?: number; requestedUserId?: number } = {};
  if (senderId !== undefined) {
    whereClause.requestingUserId = senderId;
  }
  if (receiverId !== undefined) {
    whereClause.requestedUserId = receiverId;
  }
  try {
    return await prisma.relationship.findMany({
      where: whereClause,
    });
  } catch (error) {
    throw error;
  }
}

// マッチリクエストの承認
export async function approveRequest(matchId: number) {
  try {
    return await prisma.relationship.update({
      where: {
        id: matchId,
      },
      data: {
        status: "MATCHED",
      },
    });
  } catch (error) {
    throw error;
  }
}

// マッチリクエストの拒否
export async function rejectRequest(matchId: number) {
  try {
    return await prisma.relationship.update({
      where: {
        id: matchId,
      },
      data: {
        status: "REJECTED"
      },
    });
  } catch (error) {
    throw error;
  }
}

//ユーザーにまつわるリクエストを探す
export async function searchRequestedUser(userId: number):Promise<Relationship[]> {
  //俺をリクエストしているのは誰だ
  try {
    return await prisma.relationship.findMany({
      where: {
        AND: {
          requestedUserId: userId,
          status: "PENDING",
        }
      }
    });
  } catch(error) {
    console.log("failed to search requestedUsers")
    throw error;
  }
}
// export async function searchRequestingUser(userId: number):Promise<Relationship[]> {
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
export async function searchMatchedUser(userId: number):Promise<Relationship[]> {
  try {
    return await prisma.relationship.findMany({
      where: {
        AND: {
          status: "MATCHED",
          OR: [
            {
              requestedUserId: userId,
            },
            {
              requestingUserId: userId,
            },
          ]
        }
      }
    });
  } catch(error) {
    console.log("failed to search matched Users")
    throw error;
  }
}