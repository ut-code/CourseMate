import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig";

async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

export default function LogOutButton() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Button
      onClick={async () => {
        try {
          await signOutUser();
          enqueueSnackbar("ログアウトしました", { variant: "success" });
        } catch {
          enqueueSnackbar("ログアウトに失敗しました", { variant: "error" });
        } finally {
          navigate("/login");
        }
      }}
    >
      Log Out
    </Button>
  );
}
