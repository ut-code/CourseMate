"use client";

import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { deleteAccount } from "~/api/user";
import TopNavigation from "~/components/common/TopNavigation";
import { useAlert } from "~/components/common/alert/AlertProvider";

export default function DeleteAccount() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { enqueueSnackbar } = useSnackbar();

  const onClick = useCallback(() => {
    showAlert({
      AlertMessage: "本当にアカウントを削除しますか？",
      subAlertMessage: "このアカウントに関連するすべてのデータが失われます。",
      yesMessage: "削除",
      clickYes: async () => {
        try {
          await deleteAccount();
          enqueueSnackbar("アカウントを削除しました", { variant: "success" });
        } catch (error) {
          console.error(error);
          enqueueSnackbar("アカウントの削除に失敗しました", {
            variant: "error",
          });
        } finally {
          router.push("/login");
        }
      },
    });
  }, [showAlert, enqueueSnackbar, router.push]);

  return (
    <div className="flex flex-col p-2">
      <TopNavigation title="アカウント削除" />
      <div className="w-full p-8 text-left">
        <p className="mb-4 text-center text-red-500 leading-7">
          アカウントを削除した場合、マッチングやチャットに関する情報の一切が削除されます。
        </p>
        <div className="text-center">
          <button
            type="button"
            className="btn bg-red-500 text-white hover:bg-red-700"
            onClick={onClick}
          >
            アカウントを削除する
          </button>
        </div>
      </div>
    </div>
  );
}
