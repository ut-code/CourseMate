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
export async function approveRequest(senderId: number, receiverId: number) {
  try {
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
  } catch (error) {
    throw error;
  }
}

// マッチリクエストの拒否
export async function rejectRequest(senderId: number, receiverId: number) {
  try {
    return await prisma.relationship.update({
      where: {
        requestingUserId_requestedUserId: {
          requestingUserId: senderId,
          requestedUserId: receiverId,
        },
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
export async function searchSenderByReceiverId(userId: number) {
  //俺をリクエストしているのは誰だ
  try {
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
  } catch (error) {
    console.log("failed to search requestedUsers");
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
export async function searchMatchedUser(userId: number) {
  try {
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
  } catch (error) {
    console.log("failed to search matched Users");
    throw error;
  }
}