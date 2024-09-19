import { Button } from "@mui/material";
import { useState } from "react";
import { PhotoPreview } from "../../../components/config/PhotoPreview";
import { photo } from "../../../components/data/photo-preview";
import type { BackProp, StepProps } from "../common";

export type Step3Data = {
  pictureUrl: string;
};

export default function Step3({
  onSave,
  back,
}: StepProps<Step3Data> & BackProp) {
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function save() {
    try {
      if (!photo.upload) {
        throw new Error("画像は入力必須です");
      }
      const url = await photo.upload();

      const data = {
        pictureUrl: url,
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

  return (
    <>
      <PhotoPreview />
      {errorMessage && <span>{errorMessage}</span>}
      <Button onClick={back}>戻る</Button>
      <Button onClick={save}>次へ</Button>
    </>
  );
}
