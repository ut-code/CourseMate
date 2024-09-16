import userapi from "../../api/user";
import { GUID, User } from "../../common/types";
import { getAuth } from "firebase/auth";
import { EnqueueSnackbar } from "notistack";
import { NavigateFunction } from "react-router-dom";
import { UpdateUser } from "../../common/types";

type Dependencies = {
  navigate: NavigateFunction;
  enqueueSnackbar: EnqueueSnackbar;
};

export async function register(
  data: UpdateUser,
  { navigate, enqueueSnackbar }: Dependencies,
) {
  const user = getAuth().currentUser;

  const guid = user?.uid as GUID | undefined;
  if (!guid) {
    enqueueSnackbar("ユーザ情報が取得できませんでした", {
      variant: "error",
    });
    return;
  }
  try {
    await registerUserInfo({ guid, ...data });
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
}

//ユーザー情報をデータベースに登録する関数
async function registerUserInfo(partialUser: Omit<User, "id">) {
  try {
    await userapi.create(partialUser);
  } catch (error) {
    console.error("Error during sign-up:", error);
  }
}
