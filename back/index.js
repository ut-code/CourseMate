// index.js

import express from "express";
import cors from "cors";
// import { createUser, getUser,updateUser,deleteUser, createCourse, getCourse, createFollowingRequest, getFollowingRequests, updateFollowingRequestStatus,getMatches,deleteMatch } from './helpers/prismaHelpers.js';
import userRoutes from './routes/userRoutes.js';
import followingRequestRoutes from './routes/followingRequestRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import relationshipRoutes from './routes/relationshipRoutes.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:process.env.WEB_ORIGIN}));

// ルートハンドラー
app.get('/', (req, res) => {
  res.send('konnnitiha');
});

// ルーティング
app.use('/api/users', userRoutes);
app.use('/api/followingRequests', followingRequestRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment',enrollmentRoutes);

// サーバーの起動
app.listen(port ,() =>{
  console.log("running");
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
//       console.log("ユーザーを削除しました:", user);
//   })
//   .catch(error => {
//     console.error("ユーザーの取得中にエラーが発生しました:", error);
//   });

// // AがBにフォローリクエストを送信する
// createFollowingRequest(1, 25)
//   .then(request => {
//     console.log(`${request.senderId}が${request.receiverId}にフォローリクエストをしました。`);
//   })
//   .catch(error => {
//     console.error("フォローリクエストの作成中にエラーが発生しました:", error);
//   });

//   // ユーザーAがフォローリクエストしている人を取得する
// getFollowingRequests(14)
// .then(user => {
//   const followingRequests = user.followingRequests.map(request => request.receiver.name);
//   console.log(`${user.name}がフォローリクエストしている人は${followingRequests.join(', ')}です。`);
// })
// .catch(error => {
//   console.error("フォローリクエストの取得中にエラーが発生しました:", error);
// });

// // フォローリクエストのステータスを更新する
// let newStatus ;
// updateFollowingRequestStatus(1, false, 25)
//   .then(() => {
//     const message = newStatus ? 'フォローリクエストが承諾されました。' : 'フォローリクエストが拒否されました。';
//     console.log(message);
//   })
//   .catch(error => {
//     console.error("フォローリクエストの更新中にエラーが発生しました:", error);
//   });





// // マッチング関係を読み込む
// getMatches()
//   .then(matches => {
//     matches.forEach(match => {
//       // user1とuser2が存在するかチェックする
//       if (match.user1 && match.user2) {
//         const user1Name = match.user1.name;
//         const user2Name = match.user2.name;
//         console.log(`${user1Name}と${user2Name}はマッチングしています`);
//       } else {
//         console.error("マッチング関係のユーザーが見つかりません");
//       }
//     });
//   })
//   .catch(error => {
//     console.error("マッチング関係の読み込み中にエラーが発生しました:", error);
//   });



//   // マッチング関係を削除する
// deleteMatch(2)
// .then(deletedMatch => {
//   console.log("マッチング関係を削除しました:", deletedMatch);
// })
// .catch(error => {
//   console.error("マッチング関係の削除中にエラーが発生しました:", error);
// });




