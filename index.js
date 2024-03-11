// index.js

import express from "express";
import { createUser, getUser,updateUser,deleteUser, createCourse, getCourse, createFollowingRequest, getFollowingRequests, updateFollowingRequestStatus } from './helpers/prismaHelpers.js';
import userRoutes from './routes/userRoutes.js';
import followingRequestRoutes from './routes/followingRequestRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートハンドラー
app.get('/', (req, res) => {
  res.send('konnnitiha');
});

// ルーティング
app.use('/api/users', userRoutes);
app.use('/api/followingRequests', followingRequestRoutes);
app.use('/api/courses', courseRoutes);

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// //ユーザー新規登録の例
// createUser("小林")
//   .then(newUser => {
//     console.log("新しいユーザーが作成されました:", newUser);
//   })
//   .catch(error => {
//     console.error("ユーザーの作成中にエラーが発生しました:", error);
//   });

// //ユーザー取得の例
// getUser(20)
//   .then(user => {
//     if (user) {
//       console.log("ユーザーが見つかりました:", user);
//     } else {
//       console.log("指定されたユーザーは見つかりませんでした");
//     }
//   })
//   .catch(error => {
//     console.error("ユーザーの取得中にエラーが発生しました:", error);
//   });

// //ユーザー更新の例
// updateUser(1,"砂糖")
//   .then(user => {
//       console.log("ユーザー情報を更新しました:", user);
//   })
//   .catch(error => {
//     console.error("ユーザーの取得中にエラーが発生しました:", error);
//   });

// //ユーザー削除の例
// deleteUser(13)
//   .then(user => {
//       console.log("ユーザー削除しました:", user);
//   })
//   .catch(error => {
//     console.error("ユーザーの取得中にエラーが発生しました:", error);
//   });



