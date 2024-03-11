// prismaHelpers.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ユーザーの作成
async function createUser(name, email) {
  return await prisma.user.create({
    data: {
      name,
      email
    }
  });
}

// ユーザーの取得
async function getUser(userId) {
  return await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
}

// ユーザーの更新
async function updateUser(userId, name, email) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email }
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// ユーザーの削除
async function deleteUser(userId) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
}




// コースの作成
async function createCourse(name) {
  return await prisma.course.create({
    data: {
      name
    }
  });
}

// コースの取得
async function getCourse(courseId) {
  return await prisma.course.findUnique({
    where: {
      id: courseId
    }
  });
}

// フォローリクエストの作成
async function createFollowingRequest(senderId, receiverId) {
  return await prisma.followingRequest.create({
    data: {
      sender: { connect: { id: senderId } },
      receiver: { connect: { id: receiverId } },
      status: 'PENDING'
    }
  });
}

// フォローリクエストの取得
async function getFollowingRequests(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { followingRequests: true },
  });
}

// フォローリクエストの更新
async function updateFollowingRequestStatus(senderIdToUpdate, newStatus, receiverIdToUpdate) {
  const existingRequest = await prisma.followingRequest.findFirst({
    where: {
      senderId: senderIdToUpdate,
      receiverId: receiverIdToUpdate,
    },
  });

  if (!existingRequest) {
    throw new Error('Following request not found');
  }

  return await prisma.followingRequest.update({
    where: { id: existingRequest.id },
    data: { status: newStatus ? 'ACCEPTED' : 'REJECTED' },
  });
}

export {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createCourse,
  getCourse,
  createFollowingRequest,
  getFollowingRequests,
  updateFollowingRequestStatus
};
