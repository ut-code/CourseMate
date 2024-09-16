import { Box, Button, Modal } from "@mui/material";
import { BackProp, NextButton, StepProps } from "../common";
import {
  PhotoPreview,
  PhotoPreviewButton,
} from "../../../components/config/PhotoPreview";
import { useEffect, useState } from "react";
import { uploadImage } from "../../../firebase/store/photo";

export type Step3Data = {
  pictureUrl: string;
};

export default function Step3({
  onSave,
  prev,
  back,
  caller,
}: StepProps<Step3Data> & BackProp) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [url, setURL] = useState<string>();

  async function next() {
    if (!url) throw new Error("画像は入力必須");
    const data = {
      pictureUrl: url,
    };
    onSave(data);
  }
  async function select() {
    try {
      if (!file) throw new Error("画像は入力必須です");
      const url = await uploadImage(file);
      setURL(url);
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

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log("open: ", open);
  }, [open]);
  return (
    <>
      <Modal
        id="MODAL"
        open={true}
        sx={{ visibility: open ? "visible" : "hidden" }}
      >
        <>
          <Box
            style={{ backgroundColor: "white", width: "60%", height: "80%" }}
          >
            <PhotoPreview
              defaultValueUrl={prev?.pictureUrl}
              onCrop={(f) => {
                setFile(f);
              }}
            />
            <Button
              sx={{ float: "right", marginRight: "30px" }}
              onClick={() => {
                select();
                setOpen(false);
              }}
            >
              切り取り
            </Button>
          </Box>
        </>
      </Modal>
      <div style={{ textAlign: "center" }}>
        <p>
          {url && <img style={{ width: 300, height: 300 }} src={url}></img>}
        </p>
        <PhotoPreviewButton text="写真を選択" onSelect={() => setOpen(true)} />
        {errorMessage && <span>{errorMessage}</span>}
        <Button onClick={back}>戻る</Button>
        {file === null ? (
          <Button disabled={true}>確定</Button>
        ) : (
          <NextButton caller={caller} onClick={next}>
            確定
          </NextButton>
        )}
      </div>
    </>
  );
}
