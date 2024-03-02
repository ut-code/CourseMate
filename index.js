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

// その授業を履修している人のデータを取得する
const course = "基礎統計"    //欲しいデータの授業をとる
getUsersByCourse(course)
  .then(users => {
    console.log("Users enrolled in", course + ":", users);
  })
  .catch(error => {
    console.error("Error:", error);
  });

  console.log(getUsersByCourse(course));



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
const userId = 1; // ユーザーIDを適切な値に置き換える
getFollowingRequestsSentByUser(userId)
  .then((followingRequests) => {
    console.log('Following requests sent by user:', followingRequests);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  console.log(getFollowingRequestsSentByUser(userId))



