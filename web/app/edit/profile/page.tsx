"use client";
// TODO: 挙動修正
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
    <div className="overflow-y-scroll">
      <EditProfile defaultValues={data} />
    </div>
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
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onChange",
    resolver: zodResolver(UpdateUserSchema),
  });
  async function submit(data: User) {
    await update(data);
  }

  const [savedData, setSavedData] = useState(defaultValues);

  function afterPhotoUpload(result: string) {
    try {
      updateData("pictureUrl", result);
    } catch (err) {
      console.error(err);
      // probably a network error
      enqueueSnackbar({
        message: "画像の更新に失敗しました",
      });
    }
  }

  const [open, setOpen] = useState<boolean>(false);

  function handleGoToCourses() {
    if (Math.random() < 1 /* TODO: has errors or unsaved */) {
      showAlert({
        AlertMessage: "まだ編集中のフィールド、もしくはエラーがあります",
        subAlertMessage: "本当にページを移動しますか？変更は破棄されます",
        yesMessage: "移動",
        clickYes: () => {
          router.push("/edit/courses");
        },
      });
    } else {
      router.push("/edit/courses");
    }
  }

  function handleBack() {
    if (Math.random() < 1 /* todo: has errors on unsaved */) {
      showAlert({
        AlertMessage: "編集中のフィールド、もしくはエラーがあります。",
        subAlertMessage: "本当にページを移動しますか？変更は破棄されます",
        yesMessage: "移動",
        clickYes: () => {
          router.push("/settings/profile");
        },
      });
    } else {
      router.push("/settings/profile");
    }
  }

  const values = getValues();
  return (
    <div className="mx-2 mt-2 flex h-auto w-[70vw] flex-col gap-2 overflow-y-scroll">
      <form className="" onSubmit={handleSubmit(submit)}>
        <h1 className="text-xl">プロフィール編集</h1>
        <input className="input input-bordered w-full" {...register("name")} />

        <p className="flex items-center">
          <label className="w-full">
            <h1 className="text-xl">性別</h1>
            <select
              className="select select-bordered w-full"
              {...register("gender")}
            >
              <option value={"男性"}>男性</option>
              <option value={"女性"}>女性</option>
              <option value={"その他"}>その他</option>
              <option value={"秘密"}>秘密</option>
            </select>
            <span className="text-error text-sm">{errors.gender?.message}</span>
          </label>
        </p>

        <p className="flex items-center">
          <label className="w-full">
            <h1 className="text-xl">学年</h1>
            <select
              className="select select-bordered w-full"
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
          </label>
        </p>

        <p className="flex items-center">
          <label className="w-full">
            <h1 className="text-xl">学部</h1>
            <select
              className="select select-bordered w-full"
              {...register("faculty")}
            >
              {faculties.map((fac) => (
                <option key={fac}>{fac}</option>
              ))}
            </select>
            <span className="text-error text-sm">
              {errors.faculty?.message}
            </span>
          </label>
        </p>

        <p className="flex items-center">
          <label className="w-full">
            <h1 className="text-xl">学科</h1>
            <select
              className="select select-bordered w-full"
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
          </label>
        </p>

        <p className="flex items-center justify-between">
          <label className="w-full">
            <h1 className="text-xl">自己紹介</h1>
            <textarea
              className="textarea textarea-bordered w-full"
              {...register("intro")}
              rows={3}
              autoComplete="off"
            />
          </label>
        </p>

        <div className="mt-6 text-center">
          <h1 className="text-xl">プロフィール画像</h1>
        </div>
        <div className="mt-6 flex flex-col items-center text-center">
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

        <p className="mt-10 flex content-between ">
          <button
            type="button"
            className="btn w-[35vh] rounded-full shadow-gray-400 shadow-md"
            onClick={handleBack}
          >
            設定画面に戻る
          </button>
          <button
            type="submit"
            className="btn btn-primary w-[35vh] rounded-full shadow-gray-400 shadow-md"
          >
            save!
          </button>
          <button
            type="button"
            className="btn btn-secondary w-[35vh] rounded-full shadow-gray-400 shadow-md"
            onClick={handleGoToCourses}
          >
            授業編集へ
          </button>
        </p>
      </form>
    </div>
  );
}
