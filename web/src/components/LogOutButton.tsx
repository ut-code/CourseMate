import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import AlertDialog from "./common/AlertDialog";

export default function LogOutButton() {
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

  return (
    <AlertDialog
      buttonMessage="ログアウト"
      AlertMessage="本当にログアウトしますか？"
      yesMessage="ログアウト"
      clickYes={async () => {
        await signOutUser();
      }}
    />
  );
}
