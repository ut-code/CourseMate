import { Button, TextField, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

async function signUp(uid: string, name: string, email: string, password: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        name,
        email,
        password,
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

  return (
    <div>
      <Typography component="h1" variant="h3">
        Sign Up
      </Typography>
      <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" />
      <TextField value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
      <TextField value={password} onChange={(e) => setPassword(e.target.value)} label="Password" />
      <Button
        onClick={async () => {
          const uid = user?.uid;
          if (!uid) {
            enqueueSnackbar("ユーザ情報が取得できませんでした", { variant: "error" });
            return;
          }
          try {
            await signUp(uid, name, email, password);
            enqueueSnackbar("サインアップに成功しました", { variant: "success" });
            navigate("/home");
          } catch (error) {
            console.error("Sign-up failed:", error);
            enqueueSnackbar("サインアップに失敗しました", { variant: "error" });
            navigate("/", { replace: true });
          }
        }}
      >
        Sign Up
      </Button>
    </div>
  );
}
