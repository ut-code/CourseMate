import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAlert } from "./common/alert/useAlert";

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
      <button onClick={handleClick}>ログアウト</button>
    </>
  );
}
