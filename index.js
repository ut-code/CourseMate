import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.post("/user", async (req, res) => {
  const designatedUser = await prisma.user.findFirst({where: {
    id: Number(req.body.id)
  }})
  res.send(`そのユーザーの名前は${designatedUser.name}です`)
})

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
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



//誰が誰にフォローリクエストしたというデータを登録
async function createFollowingRequest(senderId, receiverId) {
  try {
    const followingRequest = await prisma.followingRequest.create({
      data: {
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
        status: 'PENDING', // リクエストが作成されたときは常にPENDINGとします
      },
    });

    return followingRequest;
  } catch (error) {
    console.error('Error creating following request:', error);
    throw error;
  }
}



//フォローリクエストを受けるかどうか決めれて、拒否した場合フォローリクエストの情報を消去する機能
async function updateFollowingRequestStatus(senderIdToUpdate, newStatus, receiverIdToUpdate) {
  try {
    const existingRequest = await prisma.followingRequest.findFirst({
      where: {
        senderId: senderIdToUpdate,
        receiverId: receiverIdToUpdate,
      },
    });

    if (!existingRequest) {
      throw new Error('Following request not found');
    }

    const updatedRequest = await prisma.followingRequest.update({
      where: { id: existingRequest.id },
      data: { status: newStatus ? 'ACCEPTED' : 'REJECTED' }, // 新しい状態に応じて更新
    });

    return updatedRequest;
  } catch (error) {
    console.error('Error updating following request status:', error);
    throw error;
  }
}






// // getUseByCourse関数の使用例
// const course = "数学"    //欲しいデータの授業をとる
// getUsersByCourse(course)
//   .then(users => {
//     console.log("Users enrolled in", course + ":", users);
//   })
//   .catch(error => {
//     console.error("Error:", error);
//   });
// console.log(getUsersByCourse(course));



// getFollowingRequestsSentByUser関数の使用例
const userId = 1; // 取得したいユーザーのユーザーIDを入れる
getFollowingRequestsSentByUser(userId)
  .then((followingRequests) => {
    console.log('Following requests sent by user:', followingRequests);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
console.log(getFollowingRequestsSentByUser(userId))


// createFollowingRequest関数の使用例
const senderId = 18; // 送信者のユーザーID
const receiverId = 8; // 受信者のユーザーID

createFollowingRequest(senderId, receiverId)
  .then((followingRequest) => {
    console.log('Following request created:', followingRequest);
  })
  .catch((error) => {
    console.error('Error:', error);
  });



// updateFollowingRequestStatus関数の使用例
const senderIdToUpdate = 19; // フォローリクエストを送った人のユーザーID
const newStatus = false; // 新しい状態 (true: 承認, false: 拒否)
const receiverIdToUpdate = 21; // リクエストを受け取った人のユーザーID

updateFollowingRequestStatus(senderIdToUpdate, newStatus, receiverIdToUpdate)
  .then((updatedRequest) => {
    console.log('Following request updated:', updatedRequest);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

