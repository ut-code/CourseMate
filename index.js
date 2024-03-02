import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const client = new PrismaClient();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.send(`All users: ${users.map((user) => user.name).join(", ")}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



async function getUsersByCourse(courseName) {
  try {
    // 指定された授業名に一致するコースを取得
    const course = await prisma.course.findUnique({
      where: {
        name: courseName
      },
      include: {
        users: true // コースに関連するすべてのユーザーを取得
      }
    });

    if (course) {
      // コースに関連するユーザーを返す
      return course.users;
    } else {
      // コースが見つからない場合は空の配列を返す
      return [];
    }
  } catch (error) {
    console.error("Error fetching users by course:", error);
    throw error;
  } finally {
    await prisma.$disconnect(); // Prismaクライアントの切断
  }
}

// 使用例
const course = "基礎統計"    //欲しいデータの授業をとる
getUsersByCourse(course)
  .then(users => {
    console.log("Users enrolled in", course + ":", users);
  })
  .catch(error => {
    console.error("Error:", error);
  });

console.log(getUsersByCourse(course));


//誰が誰に対してフォローリクエストをしているのかというデータを取得できる
async function getFollowingRequestsSentByUser(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { followingRequests: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.followingRequests;
  } catch (error) {
    console.error('Error retrieving following requests:', error);
    throw error;
  }
}

// 使用例
const userId = 7; // 取得したいユーザーのユーザーIDを入れる
getFollowingRequestsSentByUser(userId)
  .then((followingRequests) => {
    console.log('Following requests sent by user:', followingRequests);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

console.log(getFollowingRequestsSentByUser(userId))

//誰が誰にフォローリクエストしたというデータを登録
async function createFollowingRequest(senderId, receiverId) {
  try {
    // 送信者と受信者のユーザーが存在することを確認
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    // フォローリクエストを作成してデータベースに保存
    const followingRequest = await prisma.followingRequest.create({
      data: {
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
      },
    });

    return followingRequest;
  } catch (error) {
    console.error('Error creating following request:', error);
    throw error;
  }
}

// 使用例
const senderId = 7; // 送信者のユーザーIDを加える
const receiverId = 9; // 受信者のユーザーIDを加える
createFollowingRequest(senderId, receiverId)
  .then((followingRequest) => {
    console.log('Following request created:', followingRequest);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


//フォローリクエストを受けるか受けないかを決めれる

async function updateFollowingRequestStatus(senderIdToUpdate, newStatus, receiverIdToUpdate) {
  try {
    // フォローリクエストが存在するか確認
    const existingRequest = await prisma.followingRequest.findFirst({
      where: {
        senderId: senderIdToUpdate,
        receiverId: receiverIdToUpdate
      }
    });

    if (!existingRequest) {
      throw new Error('Following request not found');
    }

    // フォローリクエストの状態を更新
    const updatedRequest = await prisma.followingRequest.update({
      where: { id: existingRequest.id },
      data: { isAccepted: newStatus },
    });

    return updatedRequest;
  } catch (error) {
    console.error('Error updating following request status:', error);
    throw error;
  }
}

// 使用例
const senderIdToUpdate = 1; // フォローリクエストを送った人のユーザーID
const newStatus = true; // 新しい状態 (true: 承認, false: 拒否)
const receiverIdToUpdate = 9; // リクエストを受け取った人のユーザーID
updateFollowingRequestStatus(senderIdToUpdate, newStatus, receiverIdToUpdate)
  .then((updatedRequest) => {
    console.log('Following request updated:', updatedRequest);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
