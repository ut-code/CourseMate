import { getAuth } from "firebase/auth";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { EnqueueSnackbar } from "notistack";
import * as userAPI from "../../api/user";
import type { GUID, User } from "../../common/types";
import type { UpdateUser } from "../../common/types";

type Dependencies = {
  router: AppRouterInstance;
  enqueueSnackbar: EnqueueSnackbar;
};

export async function register(
  data: UpdateUser,
  { router, enqueueSnackbar }: Dependencies,
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
    enqueueSnackbar("アカウントが作成されました！", {
      variant: "success",
    });
  } catch (error) {
    console.error("Sign-up failed:", error);
    enqueueSnackbar("アカウント作成に失敗しました", {
      variant: "error",
    });
    router.replace("/");
  }
}

//ユーザー情報をデータベースに登録する関数
async function registerUserInfo(partialUser: Omit<User, "id">) {
  try {
    await userAPI.create(partialUser);
  } catch (error) {
    console.error("Error during sign-up:", error);
  }
}
