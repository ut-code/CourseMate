import { error, panic } from "common/lib/panic";
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
export async function createUser(partialUser: Omit<User, "id">): Promise<User> {
  const newUser = await prisma.user.create({
    data: partialUser,
  });
  return newUser;
}

// ユーザーの取得
export async function getUser(guid: GUID): Promise<UserWithCoursesAndSubjects> {
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
  if (!user) error("not found", 404);
  return {
    ...user,
    interestSubjects: user.interests.map((interest) => {
      return interest.subject;
    }),
    courses: user.enrollments.map((enrollment) => {
      return enrollment.course;
    }),
  };
}
export async function getGUIDByUserID(id: UserID): Promise<GUID> {
  return prisma.user
    .findUnique({
      where: { id },
      select: { guid: true },
    })
    .then((v) => v?.guid ?? panic("not found"));
}
export async function getUserIDByGUID(guid: GUID): Promise<UserID> {
  return prisma.user
    .findUnique({
      where: { guid },
      select: { id: true },
    })
    .then((res) => res?.id ?? panic("not found"));
}

export async function getUserByID(
  id: UserID,
): Promise<UserWithCoursesAndSubjects> {
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
  if (!user) throw new Error("not found");
  return {
    ...user,
    interestSubjects: user.interests.map((interest) => {
      return interest.subject;
    }),
    courses: user.enrollments.map((enrollment) => {
      return enrollment.course;
    }),
  };
}

// ユーザーの更新
export async function updateUser(
  userId: UserID,
  partialUser: Partial<UpdateUser>,
): Promise<User> {
  // undefined means do nothing to this field
  // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined#use-case-null-and-undefined-in-a-graphql-resolver
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
  return updatedUser ?? panic("not found");
}

// ユーザーの削除
export async function deleteUser(userId: UserID): Promise<User> {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser ?? panic("not found");
}

// ユーザーの全取得
export async function getAllUsers(): Promise<
  (User & { courses: Course[]; interestSubjects: InterestSubject[] })[]
> {
  const users = await prisma.user.findMany({
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
  return users.map((user) => {
    return {
      ...user,
      interestSubjects: user.interests.map((interest) => {
        return interest.subject;
      }),
      courses: user.enrollments.map((enrollment) => {
        return enrollment.course;
      }),
    };
  });
}

// TODO: FIXME: currently also showing users that the requester has already sent request to, to not change behavior.
// but this is probably not ideal. consider only showing people with no relation.
// (or just remove this function and use recommended() instead)
export async function unmatched(id: UserID): Promise<User[]> {
  return prisma.user.findMany({
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
  });
}
