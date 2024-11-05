"use client";

import { ListItemButton, ListItemText } from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { auth } from "../firebase/config";
import { useAlert } from "./common/alert/AlertProvider";

export default function LogOutButton() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const signOutUser = useCallback(async () => {
    try {
      await signOut(auth);
      enqueueSnackbar("ログアウトしました", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("ログアウトに失敗しました", { variant: "error" });
    } finally {
      router.push("/login");
    }
  }, [router.push, enqueueSnackbar]);

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
