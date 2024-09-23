import { signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig";
import { useAlert } from "./common/alert/AlertProvider";

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
      <button onClick={handleClick} type="button">
        ログアウト
      </button>
    </>
  );
}
