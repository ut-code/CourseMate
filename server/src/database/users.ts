import { Err, Ok, type Result } from "../common/lib/result";
import type { GUID, UpdateUser, User, UserID } from "../common/types";
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
export async function getUser(guid: GUID): Promise<Result<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        guid: guid,
      },
    });
    if (!user) return Err(404);
    return Ok(user);
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

export async function getUserByID(id: UserID): Promise<Result<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user === null ? Err(404) : Ok(user);
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
export async function getAllUsers(): Promise<Result<User[]>> {
  try {
    const users = await prisma.user.findMany();
    return Ok(users);
  } catch (e) {
    return Err(e);
  }
}
