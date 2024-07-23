import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ユーザーの作成
export async function createUser({
  uid,
  name,
  email,
  password,
  pictureUrl
}: {
  uid: string;
  name: string;
  email: string;
  password: string;
  pictureUrl: string;
}) {
  const newUser = await prisma.user.create({
    data: {
      uid,
      name,
      email,
      password,
      pictureUrl,
    },
  });
  return newUser;
}

// ユーザーの取得
export async function getUser(uid: string) {
  const user = await prisma.user.findUnique({
    where: {
      uid: uid,
    },
  });
  return user;
}

// ユーザーの更新
export async function updateUser({
  userId,
  name,
  email,
  password,
  pictureUrl
}: {
  userId: number;
  name?: string;
  email?: string;
  password?: string;
  pictureUrl?: string;
}) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email, password, pictureUrl },
  });
  return updatedUser;
}

// ユーザーの削除
export async function deleteUser(userId: number) {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser;
}

// ユーザーの全取得
export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}
