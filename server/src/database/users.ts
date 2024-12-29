import { Err, Ok, type Result } from "common/lib/result";
import type {
  Course,
  GUID,
  InterestSubject,
  UpdateUser,
  User,
  UserID,
  UserWithCoursesAndSubjects,
} from "common/types";
import { prisma } from "./client";

// ユーザーの作成
export async function createUser(
  partialUser: Omit<User, "id">,
): Promise<Result<User>> {
  try {
    const newUser = await prisma.user.create({
      data: partialUser,
    });
    return Ok(newUser);
  } catch (e) {
    return Err(e);
  }
}

// ユーザーの取得
export async function getUser(
  guid: GUID,
): Promise<Result<UserWithCoursesAndSubjects>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        guid: guid,
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
    if (!user) return Err(404);
    return Ok({
      ...user,
      interestSubjects: user.interests.map((interest) => {
        return interest.subject;
      }),
      courses: user.enrollments.map((enrollment) => {
        return enrollment.course;
      }),
    });
  } catch (e) {
    return Err(e);
  }
}
export async function getGUIDByUserID(id: UserID): Promise<Result<GUID>> {
  return prisma.user
    .findUnique({
      where: { id },
      select: { guid: true },
    })
    .then((v) => (v ? Ok(v.guid) : Err(404)))
    .catch((e) => Err(e));
}
export async function getUserIDByGUID(guid: GUID): Promise<Result<UserID>> {
  return prisma.user
    .findUnique({
      where: { guid },
      select: { id: true },
    })
    .then((res) => res?.id)
    .then((id) => (id ? Ok(id) : Err(404)))
    .catch((err) => Err(err));
}

export async function getUserByID(
  id: UserID,
): Promise<Result<UserWithCoursesAndSubjects>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
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
    if (!user) return Err(404);
    return Ok({
      ...user,
      interestSubjects: user.interests.map((interest) => {
        return interest.subject;
      }),
      courses: user.enrollments.map((enrollment) => {
        return enrollment.course;
      }),
    });
  } catch (e) {
    return Err(e);
  }
}

// ユーザーの更新
export async function updateUser(
  userId: UserID,
  partialUser: Partial<UpdateUser>,
): Promise<Result<User>> {
  // undefined means do nothing to this field
  // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined#use-case-null-and-undefined-in-a-graphql-resolver
  try {
    if (!partialUser.pictureUrl) partialUser.pictureUrl = undefined; // don't delete picture if not provided
    const updateUser = {
      id: undefined,
      guid: undefined,
      ...partialUser,
    };
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateUser,
    });
    return updatedUser === null ? Err(404) : Ok(updatedUser);
  } catch (e) {
    return Err(e);
  }
}

// ユーザーの削除
export async function deleteUser(userId: UserID): Promise<Result<User>> {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser === null ? Err(404) : Ok(deletedUser);
  } catch (e) {
    return Err(e);
  }
}

// ユーザーの全取得
export async function getAllUsers(): Promise<
  Result<(User & { courses: Course[]; interestSubjects: InterestSubject[] })[]>
> {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: 0, // exclude memo from all user search results
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
      users.map((user) => {
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

// TODO: FIXME: currently also showing users that the requester has already sent request to, to not change behavior.
// but this is probably not ideal. consider only showing people with no relation.
// (or just remove this function and use recommended() instead)
export async function unmatched(id: UserID): Promise<Result<User[]>> {
  return prisma.user
    .findMany({
      where: {
        AND: [
          {
            receivingUsers: {
              none: {
                sendingUserId: id,
                status: "MATCHED",
              },
            },
          },
          {
            sendingUsers: {
              none: {
                receivingUserId: id,
                status: "MATCHED",
              },
            },
          },
          {
            NOT: {
              id: id,
            },
          },
        ],
      },
    })
    .then((res) => Ok(res))
    .catch((err) => Err(err));
}
