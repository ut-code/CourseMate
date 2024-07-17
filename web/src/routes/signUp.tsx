import { Box, Button, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import userapi from "../api/user";
import { User } from "../../../common/types";

function todo(): never {
  throw new Error("called todo()");
}

async function signUp(uid: string, name: string, email: string) {
  const user: User = {
    id: todo(),
    uid,
    name,
    email,
  };
  const ok = userapi.create(user);
  if (!ok)
    console.error("Error during sign-up");
}

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = getAuth().currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box>
      <Header title="Sign Up" />
      <Box mt={2} mx={2} display="flex" gap={2}>
        <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" />
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
        <TextField value={password} onChange={(e) => setPassword(e.target.value)} label="Password" />
        <Button
          variant="outlined"
          sx={{ textTransform: "none" }}
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
      </Box>
    </Box>
  );
}
