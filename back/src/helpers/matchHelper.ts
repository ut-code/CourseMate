import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 特定のユーザIDを含むマッチの取得
export async function getMatchesByUserId(userId: number) {
  try {
    return await prisma.relationship.findMany({
      where: {
        AND: [
          { status: "MATCHED" },
          { OR: [{ requestingUserId: userId }, { requestedUserId: userId }] },
        ],
      },
    });
  } catch (error) {
    throw error;
  }
}

// マッチの削除
export async function deleteMatch(senderId: number, receiverId: number) {
  console.log("delete starting...")
  try {
    // 最初の条件で削除を試みる
    const recordToDelete = await prisma.relationship.findUnique({
      where: {
        requestingUserId_requestedUserId: {
          requestingUserId: senderId,
          requestedUserId: receiverId,
        },
      },
    });

    if (recordToDelete) {
      await prisma.relationship.delete({
        where: {
          id: recordToDelete.id,
        },
      });
      console.log(`Deleted record with senderId=${senderId} and receiverId=${receiverId}`);
      return;
    }

    // 次の条件で削除を試みる
    const altRecordToDelete = await prisma.relationship.findUnique({
      where: {
        requestingUserId_requestedUserId: {
          requestingUserId: receiverId,
          requestedUserId: senderId,
        },
      },
    });

    if (altRecordToDelete) {
      await prisma.relationship.delete({
        where: {
          id: altRecordToDelete.id,
        },
      });
      console.log(`Deleted record with senderId=${receiverId} and receiverId=${senderId}`);
      return;
    }

    console.log(`No matching records found for senderId=${senderId} and receiverId=${receiverId}`);
  } catch (error) {
    throw error;
  }
}
