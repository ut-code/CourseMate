import { Box, Button, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSnackbar } from "notistack";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { app } from "../firebase/firebaseconfig";

async function registerUserInfo(
  uid: string,
  name: string,
  email: string,
  password: string,
  pictureUrl: string
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        name,
        email,
        password,
        pictureUrl,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to sign up");
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
  }
}

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = getAuth().currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setPictureFile(event.target.files[0]);
    }
  };

  const handleSignUp = async () => {
    const uid = user?.uid;
    if (!uid) {
      enqueueSnackbar("ユーザ情報が取得できませんでした", {
        variant: "error",
      });
      return;
    }

    let pictureUrl = "";

    if (pictureFile) {
      const storage = getStorage(app);
      const filePath = `${uid}/${pictureFile.name}`;
      const storageRef = ref(storage, filePath);
      try {
        const snapshot = await uploadBytes(storageRef, pictureFile);
        pictureUrl = await getDownloadURL(snapshot.ref);
        console.log("File available at", pictureUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        enqueueSnackbar("画像のアップロードに失敗しました", {
          variant: "error",
        });
        return;
      }
    }

    try {
      await registerUserInfo(uid, name, email, password, pictureUrl);
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
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
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
