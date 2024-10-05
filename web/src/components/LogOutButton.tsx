import { ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { auth } from "../firebase/config";
import { useAlert } from "./common/alert/AlertProvider";

export default function LogOutButton() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const signOutUser = useCallback(async () => {
    try {
      await signOut(auth);
      enqueueSnackbar("ログアウトしました", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("ログアウトに失敗しました", { variant: "error" });
    } finally {
      navigate({ to: "/login" });
    }
  }, [navigate, enqueueSnackbar]);

  const onClick = useCallback(() => {
    showAlert({
      AlertMessage: "本当にログアウトしますか？",
      yesMessage: "ログアウト",
      clickYes: () => {
        signOutUser();
      },
    });
  }, [showAlert, signOutUser]);

  return (
    <ListItemButton onClick={onClick}>
      <ListItemText primary="ログアウト" sx={{ color: "indianred" }} />
    </ListItemButton>
  );
}
