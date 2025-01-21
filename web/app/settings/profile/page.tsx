"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "common/types";
import { UpdateUserSchema } from "common/zod/schemas";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { update, useAboutMe } from "~/api/user";
import { facultiesAndDepartments } from "~/app/signup/data";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { useAlert } from "~/components/common/alert/AlertProvider";
import PhotoModal from "~/components/config/PhotoModal";
import { PhotoPreviewButton } from "~/components/config/PhotoPreview";
import UserAvatar from "~/components/human/avatar";

const faculties = Object.keys(facultiesAndDepartments);

export default function App() {
  const { state } = useAboutMe();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";
  return loading ? (
    <FullScreenCircularProgress />
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : data ? (
    <EditProfile defaultValues={data} />
  ) : (
    <p>データがありません。</p>
  );
}

function EditProfile({ defaultValues }: { defaultValues: User }) {
  const router = useRouter();
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onChange",
    resolver: zodResolver(UpdateUserSchema),
  });
  async function submit(data: User) {
    await update(data);
  }
  function afterPhotoUpload(result: string) {
    try {
      setValue("pictureUrl", result);
    } catch (err) {
      console.error(err);
      // probably a network error
      enqueueSnackbar({
        message: "画像の更新に失敗しました",
      });
    }
  }

  const [open, setOpen] = useState<boolean>(false);

  function handleBack() {
    if (Math.random() < 1 /* todo: has errors on unsaved */) {
      showAlert({
        AlertMessage: "編集中のフィールド、もしくはエラーがあります。",
        subAlertMessage: "本当にページを移動しますか？変更は破棄されます",
        yesMessage: "移動",
        clickYes: () => {
          router.push("/settings");
        },
      });
    } else {
      router.push("/settings");
    }
  }

  const values = getValues();
  return (
    <div className="flex h-full flex-col">
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col gap-2 p-2">
          <div>
            <label htmlFor="name" className="text-md">
              名前
            </label>
            <input
              className="input input-bordered w-full"
              id="name"
              {...register("name")}
            />
          </div>
          <div>
            <label htmlFor="gender" className="text-md">
              性別
            </label>
            <select
              className="select select-bordered w-full"
              id="gender"
              {...register("gender")}
            >
              <option value={"男性"}>男性</option>
              <option value={"女性"}>女性</option>
              <option value={"その他"}>その他</option>
              <option value={"秘密"}>秘密</option>
            </select>
            <span className="text-error text-sm">{errors.gender?.message}</span>
          </div>
          <div>
            <label htmlFor="grade" className="text-md">
              学年
            </label>
            <select
              className="select select-bordered w-full"
              id="grade"
              {...register("grade")}
            >
              <option value={"B1"}>1年生 (B1)</option>
              <option value={"B2"}>2年生 (B2)</option>
              <option value={"B3"}>3年生 (B3)</option>
              <option value={"B4"}>4年生 (B4)</option>
              <option value={"M1"}>修士1年 (M1)</option>
              <option value={"M2"}>修士2年 (M2)</option>
            </select>
            <span className="text-error text-sm">{errors.grade?.message}</span>
          </div>
          <div>
            <label htmlFor="faculty" className="text-md">
              学部
            </label>
            <select
              className="select select-bordered w-full"
              id="faculty"
              {...register("faculty")}
            >
              {faculties.map((fac) => (
                <option key={fac}>{fac}</option>
              ))}
            </select>
            <span className="text-error text-sm">
              {errors.faculty?.message}
            </span>
          </div>
          <div>
            <label htmlFor="department" className="text-md">
              学科
            </label>
            <select
              className="select select-bordered w-full"
              id="department"
              {...register("department")}
            >
              {values.faculty &&
                facultiesAndDepartments[values.faculty].map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
            </select>
            <span className="text-error text-sm">
              {errors.department?.message}
            </span>
          </div>
          <div>
            <label htmlFor="intro" className="text-md">
              自己紹介
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              id="intro"
              {...register("intro")}
              rows={3}
              autoComplete="off"
            />
          </div>
          <div className="mt-4 flex flex-col items-center text-center">
            <span className="text-md">プロフィール画像</span>
            <div style={{ margin: "auto" }}>
              <UserAvatar
                width="300px"
                height="300px"
                pictureUrl={values.pictureUrl}
              />
            </div>
            <PhotoPreviewButton
              text="写真を選択"
              onSelect={() => setOpen(true)}
            />
            <PhotoModal
              open={open}
              closeFunc={() => setOpen(false)}
              afterUpload={afterPhotoUpload}
              onError={(err) =>
                enqueueSnackbar({
                  variant: "error",
                  message: err.message,
                })
              }
            />
            <span className="text-error text-sm">
              {errors.pictureUrl?.message}
            </span>
          </div>
          <div className="flex justify-between">
            {/* TODO: 戻るボタンは Header につける */}
            <button type="button" className="btn btn-sm" onClick={handleBack}>
              設定画面に戻る
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => router.push("/settings/card")}
            >
              カードを見る
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              保存
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
