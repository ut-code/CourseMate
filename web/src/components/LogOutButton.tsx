import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseconfig";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

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
