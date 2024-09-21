import { getAuth } from "firebase/auth";
import type { EnqueueSnackbar } from "notistack";
import type { NavigateFunction } from "react-router-dom";
import userapi from "../../api/user";
import type { GUID, User } from "../../common/types";
import type { UpdateUser } from "../../common/types";

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
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
    return;
  }
  try {
    await registerUserInfo({ guid, ...data });
    enqueueSnackbar("サインアップに成功しました", {
      variant: "success",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
    navigate("/home");
  } catch (error) {
    console.error("Sign-up failed:", error);
    enqueueSnackbar("サインアップに失敗しました", {
      variant: "error",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
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
