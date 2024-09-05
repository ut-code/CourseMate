import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import userapi from "../api/user";
import { GUID, User } from "../common/types";
import { EditUserBox, UserData } from "../components/EditUserBox";

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = getAuth().currentUser;

  //サインアップの処理
  const handleSignUp = async (partial: UserData) => {
    const guid = user?.uid as GUID | undefined;
    if (!guid) {
      enqueueSnackbar("ユーザ情報が取得できませんでした", {
        variant: "error",
      });
      return;
    }
    try {
      await registerUserInfo({ guid, ...partial });
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
      <EditUserBox
        save={handleSignUp}
        saveButtonText="登録"
        allowClose={false}
      />
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
