import { styled } from "@mui/material/styles";
import { signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig";
import { useAlert } from "./common/alert/AlertProvider";

const StyledButton = styled("button")({
  backgroundColor: "white",
  border: "1px solid black",
  color: "red",
  padding: "10px 20px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  marginTop: "20px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
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
