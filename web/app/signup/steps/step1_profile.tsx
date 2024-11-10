import { type ChangeEvent, useState } from "react";

import type { StepProps } from "~/app/signup/common";
import { facultiesAndDepartments } from "~/app/signup/data";
import { parseStep1UserSchema } from "~/common/zod/methods";
import type { Step1User } from "~/common/zod/types";

function Label({ children }: { children: string }) {
  return <span className="text-gray-500 text-sm">{children}</span>;
}

const faculties = Object.keys(facultiesAndDepartments);
export default function Step1({ onSave, prev, caller }: StepProps<Step1User>) {
  const [name, setName] = useState(prev?.name ?? "");
  const [gender, setGender] = useState(prev?.gender ?? "その他");
  const [grade, setGrade] = useState(prev?.grade ?? "");
  const [faculty, setFaculty] = useState(prev?.faculty ?? "");
  const [department, setDepartment] = useState(prev?.department ?? "");
  const [intro, setIntro] = useState(prev?.intro ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  async function save() {
    try {
      const data: Step1User = {
        name: name.trim(),
        grade: grade,
        gender: gender,
        faculty: faculty,
        department: department,
        intro: intro.trim(),
      };
      parseStep1UserSchema(data);
      onSave(data);
    } catch (error) {
      if (error instanceof Error) {
        let errorMessages: string;
        try {
          const parsedError = JSON.parse(error.message);
          if (Array.isArray(parsedError)) {
            errorMessages = parsedError.map((err) => err.message).join(", ");
          } else {
            errorMessages = error.message;
          }
        } catch {
          errorMessages = error.message;
        }

        // エラーメッセージをセット
        setErrorMessage(errorMessages);
      } else {
        console.log("unknown error:", error);
        setErrorMessage("入力に誤りがあります。");
      }
    }
  }

  const handleFacultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFaculty(event.target.value);
  };

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDepartment(event.target.value);
  };

  return (
    <>
      <div className="m-4 mb-8 flex flex-col gap-4 ">
        <h1 className="text-xl">アカウント設定</h1>
        <div className="flex flex-col gap-2">
          <Label>名前</Label>
          <input
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <Label>性別</Label>
          <select
            className="select select-bordered w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value={"男性"}>男性</option>
            <option value={"女性"}>女性</option>
            <option value={"その他"}>その他</option>
            <option value={"秘密"}>秘密</option>
          </select>
          <Label>学年</Label>
          <select
            className="select select-bordered w-full"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value={"B1"}>1年生 (B1)</option>
            <option value={"B2"}>2年生 (B2)</option>
            <option value={"B3"}>3年生 (B3)</option>
            <option value={"B4"}>4年生 (B4)</option>
            <option value={"M1"}>修士1年 (M1)</option>
            <option value={"M2"}>修士2年 (M2)</option>
          </select>
          <Label>学部</Label>
          <select
            className="select select-bordered w-full"
            value={faculty}
            onChange={handleFacultyChange}
          >
            {faculties.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
          <Label>学科 (先に学部を選択して下さい)</Label>
          <select
            className="select select-bordered w-full"
            value={department}
            onChange={handleDepartmentChange}
            disabled={!faculty}
          >
            {faculty &&
              facultiesAndDepartments[faculty].map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
          </select>
          <Label>自己紹介</Label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={5}
            placeholder="こんにちは！仲良くして下さい！"
            onChange={(e) => setIntro(e.target.value)}
          />
          {errorMessage && (
            <div className="mb-4 text-error">{errorMessage}</div>
          )}
        </div>
      </div>
      <div className="fixed bottom-5 flex w-full justify-between p-6">
        <span />
        <button type="button" onClick={save} className="btn btn-primary">
          {caller === "registration" ? "次へ" : "保存"}
        </button>
      </div>
    </>
  );
}
