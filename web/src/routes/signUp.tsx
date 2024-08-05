import { Box, Button, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSnackbar } from "notistack";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import userapi from "../api/user";
import { GUID, User } from "../common/types";
import { app } from "../firebase/firebaseconfig";

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = getAuth().currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pictureFile, setPictureFile] = useState<File>();

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
      const pictureUrl = await uploadImage(guid, pictureFile!);
      const partialUser: Omit<User, "id"> = {
        guid,
        name,
        email,
        pictureUrl,
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

  //画像を選択する関数
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setPictureFile(event.target.files[0]);
    } else {
      return;
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
        <input type="file" onChange={handleImageChange} />
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

//画像をfirestoreにアップロードする関数
async function uploadImage(guid: GUID, pictureFile: File) {
  if (!pictureFile) {
    return "";
  }

  const storage = getStorage(app);
  const filePath = `${guid}/${pictureFile.name}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, pictureFile);
    const pictureUrl = await getDownloadURL(snapshot.ref);
    console.log("File available at", pictureUrl);
    return pictureUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("画像のアップロードに失敗しました");
  }
}
