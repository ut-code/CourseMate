import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import user, { getByGUID } from "../api/user";
import type { GUID } from "../common/types";
import Header from "../components/Header";
import { auth } from "../firebase/firebaseconfig";
import "../styles/login.css";

const provider = new GoogleAuthProvider();

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      return user.uid;
    }
  } catch (error) {
    console.error(error);
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  async function logInByGoogle() {
    try {
      await signInWithGoogle();
      if (auth.currentUser === null) {
        throw new Error("ログインに失敗しました");
      }

      const response = await getByGUID(auth.currentUser.uid as GUID);

      if (response.status === 404) {
        enqueueSnackbar(
          "この Google アカウントは登録されていません。登録画面にリダイレクトしました。",
          { variant: "info" },
        );
        navigate("/signup");
      } else if (response.status >= 500) {
        enqueueSnackbar(
          "サーバーエラーが発生しました。しばらくしてから再度お試しください。",
          { variant: "error" },
        );
      } else if (response.data) {
        enqueueSnackbar(`こんにちは、${response.data.name} さん！`, {
          variant: "success",
        });
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Google アカウントでのログインに失敗しました", {
        variant: "error",
      });
    }
  }

  async function singUpByGoogle() {
    try {
      const guid = await signInWithGoogle();
      if (!guid) {
        throw new Error("no guid");
      }

      const userExists = await user.exists(guid as GUID);

      if (userExists) {
        enqueueSnackbar("この Google アカウントはすでに登録されています", {
          variant: "error",
        });
        navigate("/login");
      } else {
        enqueueSnackbar("新規登録を開始します", { variant: "info" });
        navigate("/signup");
      }
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Google アカウントでのサインアップに失敗しました", {
        variant: "error",
      });
    }
  }

  return (
    <>
      <Header title="CourseMate" />
      <Box
        sx={{
          position: "absolute",
          top: "56px",
          bottom: 0,
          left: 0,
          right: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box textAlign="center" mb={4}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <EmojiEmotionsIcon
              style={{ color: "#000000", width: "200px", height: "200px" }}
            />
          </IconButton>
          <Typography>CourseMateを使って同じ授業の人と友達になろう</Typography>
        </Box>

        <Box>
          <button
            className="gsi-material-button"
            onClick={logInByGoogle}
            type="button"
          >
            <div className="gsi-material-button-state" />
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  style={{ display: "block" }}
                  role="img"
                  aria-label="Sign in with Google"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>
              <span className="gsi-material-button-contents">
                Sign in with Google
              </span>
              <span style={{ display: "none" }}>Sign in with Google</span>
            </div>
          </button>
        </Box>
        <Link component={Button} onClick={singUpByGoogle} mt={2}>
          初めての方はこちら
        </Link>
      </Box>
    </>
  );
}
