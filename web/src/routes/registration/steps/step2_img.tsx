import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  PhotoPreview,
  PhotoPreviewButton,
} from "../../../components/config/PhotoPreview";
import UserAvatar from "../../../components/human/avatar";
import { uploadImage } from "../../../firebase/store/photo";
import { type BackProp, NextButton, type StepProps } from "../common";

export type Step2Data = {
  pictureUrl: string;
};

export default function Step2({
  onSave,
  prev,
  back,
  caller,
}: StepProps<Step2Data> & BackProp) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [url, setURL] = useState<string>("");

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

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log("open: ", open);
  }, [open]);
  return (
    <div>
      <Typography
        variant="h5"
        style={{ textAlign: "left", marginTop: "2vh", marginLeft: "10px" }}
      >
        アイコンを設定
      </Typography>

      <div style={{ textAlign: "center", marginTop: "15vh" }}>
        <Modal
          id="MODAL"
          open={true}
          sx={{
            visibility: open ? "visible" : "hidden",
            Margin: "auto",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Box
            style={{
              backgroundColor: "white",
              width: "90%",
              height: "auto",
              padding: "20px",
            }}
          >
            <PhotoPreview
              prev={prev?.pictureUrl}
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
        </Modal>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <UserAvatar width="35vh" height="35vh" pictureUrl={url} />
          <div style={{ marginTop: "10vh" }}>
            <PhotoPreviewButton
              text="写真を選択"
              onSelect={() => setOpen(true)}
            />
          </div>
          {errorMessage && <span>{errorMessage}</span>}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={back}>戻る</Button>
            {file === null ? (
              <Button disabled={true}>
                {caller === "registration" ? "確定" : "保存"}
              </Button>
            ) : (
              <NextButton onClick={next}>
                {caller === "registration" ? "確定" : "保存"}
              </NextButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
