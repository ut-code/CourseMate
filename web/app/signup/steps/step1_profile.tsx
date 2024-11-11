import { useEffect } from "react";

import type { StepProps } from "~/app/signup/common";
import { facultiesAndDepartments } from "~/app/signup/data";
import type { Step1User } from "~/common/zod/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldError, type SubmitHandler, useForm } from "react-hook-form";
import { Step1UserSchema } from "~/common/zod/schemas";

const faculties = Object.keys(facultiesAndDepartments);
export default function Step1({ onSave, prev, caller }: StepProps<Step1User>) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<Step1User>({
    resolver: zodResolver(Step1UserSchema),
    defaultValues: prev,
  });
  const onSubmit: SubmitHandler<Step1User> = async (data) => {
    onSave(data);
  };
  const selectedFaculty = watch("faculty");

  useEffect(() => {
    if (selectedFaculty) {
      const defaultDepartment = facultiesAndDepartments[selectedFaculty][0];
      setValue("department", defaultDepartment);
    } else {
      resetField("department");
    }
  }, [selectedFaculty, setValue, resetField]);
  return (
    <>
      <div className="m-4 mb-8 flex flex-col gap-4">
        <h1 className="text-xl">アカウント設定</h1>
        <div className="flex flex-col gap-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field fieldName="name" fieldLabel="名前" error={errors?.name}>
              <input
                className="input input-bordered w-full"
                {...register("name")}
              />
            </Field>
            <Field fieldName="gender" fieldLabel="性別" error={errors?.gender}>
              <select
                className="select select-bordered w-full"
                {...register("gender")}
              >
                <option value={"男性"}>男性</option>
                <option value={"女性"}>女性</option>
                <option value={"その他"}>その他</option>
                <option value={"秘密"}>秘密</option>
              </select>
            </Field>
            <Field fieldName="grade" fieldLabel="学年" error={errors?.grade}>
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
            </Field>
            <Field
              fieldName="faculty"
              fieldLabel="学部"
              error={errors?.faculty}
            >
              <select
                className="select select-bordered w-full"
                {...register("faculty")}
              >
                {faculties.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              fieldName="department"
              fieldLabel="学科 (先に学部を選択して下さい)"
              error={errors?.department}
            >
              <select
                className="select select-bordered w-full"
                {...register("department")}
                disabled={!selectedFaculty}
              >
                {selectedFaculty &&
                  facultiesAndDepartments[selectedFaculty].map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
              </select>
            </Field>
            <Field
              fieldName="intro"
              fieldLabel="自己紹介"
              error={errors?.intro}
            >
              <textarea
                className="textarea textarea-bordered w-full"
                rows={5}
                placeholder="こんにちは！仲良くして下さい！"
                {...register("intro")}
              />
            </Field>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                {caller === "registration" ? "次へ" : "保存"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function Field({
  fieldLabel,
  children,
  error,
}: {
  fieldName: string;
  fieldLabel: string;
  children: React.ReactNode;
  error: FieldError | undefined;
}) {
  return (
    <div className="my-2">
      <div className="text-gray-500 text-sm">{fieldLabel}</div>
      {children}
      <div className="text-error text-sm">{error?.message}</div>
    </div>
  );
}
