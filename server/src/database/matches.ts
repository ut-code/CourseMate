import { PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";

const prisma = new PrismaClient();

// 特定のユーザIDを含むマッチの取得
export async function getMatchesByUserId(userId: UserID) {
  return await prisma.relationship.findMany({
    where: {
      AND: [
        { status: "MATCHED" },
        { OR: [{ sendingUserId: userId }, { receivingUserId: userId }] },
      ],
    },
  });
}

// マッチの削除
export async function deleteMatch(senderId: UserID, receiverId: UserID) {
  console.log("delete starting...");
  // 最初の条件で削除を試みる
  const recordToDelete = await prisma.relationship.findUnique({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: senderId,
        receivingUserId: receiverId,
      },
    },
  });

  if (recordToDelete) {
    await prisma.relationship.delete({
      where: {
        id: recordToDelete.id,
      },
    });
    console.log(
      `Deleted record with senderId=${senderId} and receiverId=${receiverId}`,
    );
    return;
  }

  // 次の条件で削除を試みる
  const altRecordToDelete = await prisma.relationship.findUnique({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: receiverId,
        receivingUserId: senderId,
      },
    },
  });

  if (altRecordToDelete) {
    await prisma.relationship.delete({
      where: {
        id: altRecordToDelete.id,
      },
    });
    console.log(
      `Deleted record with senderId=${receiverId} and receiverId=${senderId}`,
    );
    return;
  }

  console.log(
    `No matching records found for senderId=${senderId} and receiverId=${receiverId}`,
  );
}
