import { Box, Button } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig";
import { useSnackbar } from "notistack";
import Header from "../components/Header";

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
              enqueueSnackbar("Google アカウントでログインしました", {
                variant: "success",
              });
              navigate("/home");
            } catch {
              enqueueSnackbar("Google アカウントでのログインに失敗しました", {
                variant: "error",
              });
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
              const uid = await signInWithGoogle();
              const response = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/users/${uid}`,
              );

              if (response.status !== 404) {
                enqueueSnackbar(
                  "この Google アカウントはすでに登録されています",
                  { variant: "error" },
                );
                navigate("/login");
              } else {
                enqueueSnackbar("新規登録を開始します", { variant: "info" });
                navigate("/signup");
              }
            } catch (error) {
              enqueueSnackbar("エラーが発生しました", { variant: "error" });
            }
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}
