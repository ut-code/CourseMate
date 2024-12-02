import { Err, Ok, type Result } from "common/lib/result";
import type {
  Relationship,
  UserID,
  UserWithCoursesAndSubjects,
} from "common/types";
import { prisma } from "./client";

// マッチリクエストの送信
export async function sendRequest({
  senderId,
  receiverId,
}: {
  senderId: UserID;
  receiverId: UserID;
}): Promise<Result<Relationship>> {
  // 既存の関係をチェック
  try {
    // TODO: fix this findFirst to be findUnique
    const existingRelationship = await prisma.relationship.findFirst({
      where: {
        OR: [
          { sendingUserId: senderId, receivingUserId: receiverId },
          { sendingUserId: receiverId, receivingUserId: senderId }, // 逆の関係もチェック
        ],
      },
    });
    // 既存の関係がある場合はそのまま返す
    if (existingRelationship) {
      // 相手がすでにこちらに Request を送っている場合は approve (accept) したとみなす
      if (existingRelationship.receivingUserId === senderId)
        approveRequest(
          existingRelationship.sendingUserId,
          existingRelationship.receivingUserId,
        );
      return Ok(existingRelationship);
    }
    const newRelationship = await prisma.relationship.create({
      data: {
        sendingUser: { connect: { id: senderId } },
        receivingUser: { connect: { id: receiverId } },
        status: "PENDING",
      },
    });
    return Ok(newRelationship);
  } catch (e) {
    return Err(e);
  }
}

// マッチリクエストの承認
export async function approveRequest(
  senderId: UserID,
  receiverId: UserID,
): Promise<Result<Relationship>> {
  try {
    const updated = await prisma.relationship.update({
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
    return updated === null ? Err(404) : Ok(updated);
  } catch (e) {
    return Err(e);
  }
}

// マッチリクエストの拒否
export async function rejectRequest(
  senderId: UserID,
  receiverId: UserID,
): Promise<Result<Relationship>> {
  try {
    const rel = await prisma.relationship.update({
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
    return rel === null ? Err(404) : Ok(rel);
  } catch (e) {
    return Err(e);
  }
}

export async function cancelRequest(
  senderId: UserID,
  receiverId: UserID,
): Promise<Result<void>> {
  try {
    return prisma.relationship
      .delete({
        where: {
          sendingUserId_receivingUserId: {
            sendingUserId: senderId,
            receivingUserId: receiverId,
          },
        },
      })
      .then(() => Ok(undefined))
      .catch((err) => Err(err));
  } catch (err) {
    return Err(err);
  }
}

//ユーザーへのリクエストを探す 俺をリクエストしているのは誰だ
export async function getPendingRequestsToUser(
  userId: UserID,
): Promise<Result<UserWithCoursesAndSubjects[]>> {
  try {
    const found = await prisma.user.findMany({
      where: {
        sendingUsers: {
          some: {
            receivingUserId: userId,
            status: "PENDING",
          },
        },
      },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                enrollments: true,
                slots: true,
              },
            },
          },
        },
        interests: {
          include: {
            subject: true,
          },
        },
      },
    });
    return Ok(
      found.map((user) => {
        return {
          ...user,
          interestSubjects: user.interests.map((interest) => {
            return interest.subject;
          }),
          courses: user.enrollments.map((enrollment) => {
            return enrollment.course;
          }),
        };
      }),
    );
  } catch (e) {
    return Err(e);
  }
}

//ユーザーがリクエストしている人を探す 俺がリクエストしているのは誰だ
export async function getPendingRequestsFromUser(
  userId: UserID,
): Promise<Result<UserWithCoursesAndSubjects[]>> {
  try {
    const found = await prisma.user.findMany({
      where: {
        receivingUsers: {
          some: {
            sendingUserId: userId,
            status: "PENDING",
          },
        },
      },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                enrollments: true,
                slots: true,
              },
            },
          },
        },
        interests: {
          include: {
            subject: true,
          },
        },
      },
    });
    return Ok(
      found.map((user) => {
        return {
          ...user,
          interestSubjects: user.interests.map((interest) => {
            return interest.subject;
          }),
          courses: user.enrollments.map((enrollment) => {
            return enrollment.course;
          }),
        };
      }),
    );
  } catch (e) {
    return Err(e);
  }
}

//マッチした人の取得
export async function getMatchedUser(
  userId: UserID,
): Promise<Result<UserWithCoursesAndSubjects[]>> {
  try {
    const found = await prisma.user.findMany({
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
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                enrollments: true,
                slots: true,
              },
            },
          },
        },
        interests: {
          include: {
            subject: true,
          },
        },
      },
    });
    return Ok(
      found.map((user) => {
        return {
          ...user,
          interestSubjects: user.interests.map((interest) => {
            return interest.subject;
          }),
          courses: user.enrollments.map((enrollment) => {
            return enrollment.course;
          }),
        };
      }),
    );
  } catch (e) {
    return Err(e);
  }
}
