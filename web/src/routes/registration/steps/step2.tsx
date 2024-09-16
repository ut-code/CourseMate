import { useState } from "react";

import { Button } from "@mui/material";
import { BackProp, NextButton, StepProps } from "../common";

type Enrollment = number; // TODO: fix this

export type Step2Data = {
  enrollments: Enrollment[];
};

export default function Step2({
  onSave,
  prev,
  back,
  caller,
}: StepProps<Step2Data> & BackProp) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(
    prev?.enrollments || [],
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function save() {
    try {
      // TODO: change this to actual enrollments and apply zod
      const data: Step2Data = {
        enrollments: enrollments,
      };
      onSave(data);
    } catch (error) {
      if (error instanceof Error) {
        let errorMessages;
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

  const [input, setInput] = useState<number>();
  // FIXME: fix the renderer
  return (
    <>
      <ul>
        {enrollments.map((num, idx) => (
          <li key={idx}>
            <span>{num}</span>
            <button
              onClick={() => setEnrollments(enrollments.splice(idx + 1, 1))}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(parseInt(e.target.value))}
      />
      <button
        onClick={() => {
          if (input == null) return;
          setEnrollments([...enrollments, input]);
          setInput(undefined);
        }}
      >
        Add
      </button>
      {errorMessage && <span>{errorMessage}</span>}
      <Button onClick={back}>戻る</Button>
      <NextButton
        weak={enrollments.length === 0}
        caller={caller}
        onClick={save}
      >
        {caller === "configMenu"
          ? "保存"
          : enrollments.length === 0
            ? "スキップ"
            : "次へ"}
      </NextButton>
    </>
  );
}
