// import { signOut } from "firebase/auth";
// import { useSnackbar } from "notistack";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase/firebaseconfig";
// import { useAlert } from "./common/alert/AlertProvider";

// export default function LogOutButton() {
//   const { showAlert } = useAlert();
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();

//   async function signOutUser() {
//     try {
//       await signOut(auth);
//       enqueueSnackbar("ログアウトしました", { variant: "success" });
//     } catch (error) {
//       console.error(error);
//       enqueueSnackbar("ログアウトに失敗しました", { variant: "error" });
//     } finally {
//       navigate("/login");
//     }
//   }

//   const handleClick = () => {
//     showAlert({
//       AlertMessage: "本当にログアウトしますか？",
//       yesMessage: "ログアウト",
//       clickYes: () => {
//         signOutUser();
//       },
//     });
//   };

import { styled } from "@mui/material/styles"; // スタイルを追加
//   return (
//     <>
//       <button onClick={handleClick} type="button">
//         ログアウト
//       </button>
//     </>
//   );
// }
import { signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig";
import { useAlert } from "./common/alert/AlertProvider";

// スタイルを定義
const StyledButton = styled("button")({
  backgroundColor: "white", // 背景色を白に
  border: "1px solid black", // 黒い淵を追加
  color: "red", // 文字を赤に
  padding: "10px 20px", // パディングを追加
  cursor: "pointer", // カーソルをポインターに
  transition: "background-color 0.3s", // ホバー効果を追加するためのトランジション
  marginTop: "20px",

  // ホバー時のスタイル
  "&:hover": {
    backgroundColor: "#f0f0f0", // ホバー時の背景色を変更
  },
});

export default function LogOutButton() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  async function signOutUser() {
    try {
      await signOut(auth);
      enqueueSnackbar("ログアウトしました", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("ログアウトに失敗しました", { variant: "error" });
    } finally {
      navigate("/login");
    }
  }

  const handleClick = () => {
    showAlert({
      AlertMessage: "本当にログアウトしますか？",
      yesMessage: "ログアウト",
      clickYes: () => {
        signOutUser();
      },
    });
  };

  return (
    <>
      <StyledButton onClick={handleClick} type="button">
        ログアウト
      </StyledButton>
    </>
  );
}
