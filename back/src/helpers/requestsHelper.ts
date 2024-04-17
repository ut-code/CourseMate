import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// フォローリクエストの作成
export async function createFollowingRequest(senderId, receiverId) {
  return await prisma.followingRequest.create({
    data: {
      sender: { connect: { id: senderId } },
      receiver: { connect: { id: receiverId } },
      status: "PENDING",
    },
  });
}

// フォローリクエストの取得
export async function getFollowingRequests(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { followingRequests: { include: { receiver: true } } },
  });
}

// フォローリクエストの更新
export async function updateFollowingRequestStatus(
  senderIdToUpdate,
  newStatus,
  receiverIdToUpdate
) {
  const existingRequest = await prisma.followingRequest.findFirst({
    where: {
      senderId: senderIdToUpdate,
      receiverId: receiverIdToUpdate,
    },
  });

  if (!existingRequest) {
    throw new Error("Following request not found");
  }

  // フォローリクエストのステータスを更新
  await prisma.followingRequest.update({
    where: { id: existingRequest.id },
    data: { status: newStatus ? "ACCEPTED" : "REJECTED" },
  });

  // フォローリクエストがACCEPTEDの場合、マッチング関係を作成
  if (newStatus) {
    const user1Id = senderIdToUpdate < receiverIdToUpdate ? senderIdToUpdate : receiverIdToUpdate;
    const user2Id = senderIdToUpdate > receiverIdToUpdate ? senderIdToUpdate : receiverIdToUpdate;

    // マッチング関係を作成
    await prisma.match.create({
      data: {
        user1: { connect: { id: user1Id } },
        user2: { connect: { id: user2Id } },
        status: "ACCEPTED",
      },
    });
  }
}

// マッチ関係を読み込む
export async function getMatches() {
  return prisma.match.findMany({
    include: {
      user1: true,
      user2: true,
    },
  });
}

// マッチ関係を削除する
export async function deleteMatch(matchId) {
  return prisma.match.delete({
    where: { id: matchId },
  });
}
