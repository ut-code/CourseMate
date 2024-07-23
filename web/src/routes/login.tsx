import { Box, Button } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig";
import { useSnackbar } from "notistack";
import Header from "../components/Header";
import user from "../api/user";

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
    throw error;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Box>
      <Header title="Login" />
      <Box mt={2} mx={2} display="flex" gap={1}>
        <Button
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={async () => {
            try {
              await signInWithGoogle();
              if (auth.currentUser === null) {
                throw new Error("ログインに失敗しました");
              }
              const userData = await user.getByGUID(auth.currentUser.uid);
              if (userData === null) {
                enqueueSnackbar(
                  "この Google アカウントは登録されていません。登録画面にリダイレクトしました。",
                  { variant: "info" },
                );
                navigate("/signup");
              } else {
                enqueueSnackbar(`こんにちは、${userData.name} さん！`, {
                  variant: "success",
                });
                navigate("/home");
              }
            } catch {
              enqueueSnackbar("Google アカウントでのログインに失敗しました", {
                variant: "error",
              });
            }
            if (auth.currentUser === null)
              throw new Error("fix this if you catch this");
            const userData = await user.getByGUID(auth.currentUser.uid);
            if (userData === null) {
              enqueueSnackbar(
                "この Google アカウントは登録されていません。登録画面にリダイレクトしました。",
                { variant: "info" },
              );
              navigate("/signup");
            } else {
              enqueueSnackbar(`こんにちは、${userData.name} さん！`, {
                variant: "success",
              });
              navigate("/home");
            }
          }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={async () => {
            try {
              const guid = await signInWithGoogle();
              if (!guid) {
                throw new Error("no guid");
              }

              const userExists = await user.exists(guid);

              if (userExists) {
                enqueueSnackbar(
                  "この Google アカウントはすでに登録されています",
                  { variant: "error" },
                );
                navigate("/login");
              } else {
                enqueueSnackbar("新規登録を開始します", { variant: "info" });
                navigate("/signup");
              }
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}
