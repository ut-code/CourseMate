import { Box, Button, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import userapi from "../api/user";
import { GUID, User } from "../common/types";
import { PhotoPreview } from "../components/PhotoPreview";
import { photo } from "../components/data/photo-preview";

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = getAuth().currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //サインアップの処理
  const handleSignUp = async () => {
    const guid = user?.uid as GUID | undefined;
    if (!guid) {
      enqueueSnackbar("ユーザ情報が取得できませんでした", {
        variant: "error",
      });
      return;
    }
    try {
      const pictureUrl = photo.upload && (await photo.upload());
      const partialUser: Omit<User, "id"> = {
        guid,
        name,
        email,
        pictureUrl: pictureUrl ?? "",
      };
      await registerUserInfo(partialUser);
      enqueueSnackbar("サインアップに成功しました", {
        variant: "success",
      });
      navigate("/home");
    } catch (error) {
      console.error("Sign-up failed:", error);
      enqueueSnackbar("サインアップに失敗しました", {
        variant: "error",
      });
      navigate("/", { replace: true });
    }
  };

  return (
    <Box>
      <Header title="Sign Up" />
      <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
        />
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
        />
        <PhotoPreview />
        <Button
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

//ユーザー情報をデータベースに登録する関数
async function registerUserInfo(partialUser: Omit<User, "id">) {
  try {
    const user = await userapi.create(partialUser);
    // TODO: use user for something or just let it drop
    user;
  } catch (error) {
    console.error("Error during sign-up:", error);
  }
}
