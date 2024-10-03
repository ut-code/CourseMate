import { Box, Button, Modal, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { uploadImage } from "../../../api/image";
import { MAX_IMAGE_SIZE } from "../../../api/internal/fetch-func";
import {
  PhotoPreview,
  PhotoPreviewButton,
} from "../../../components/config/PhotoPreview";
import UserAvatar from "../../../components/human/avatar";
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
  const [url, setURL] = useState<string>(prev?.pictureUrl ?? "");

  async function next() {
    try {
      if (!url) throw new Error("画像は入力必須です");
      const data = {
        pictureUrl: url,
      };
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
  async function select() {
    try {
      if (!file) throw new Error("画像は入力必須です");
      try {
        if (file.size >= MAX_IMAGE_SIZE) {
          enqueueSnackbar("画像が大きすぎます", {
            variant: "error",
            autoHideDuration: 2000,
          });
          return;
        }
        const url = await uploadImage(file);
        setURL(url);
      } catch {
        enqueueSnackbar("画像のアップロードに失敗しました", {
          variant: "error",
        });
      }
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
          <div>
            <PhotoPreviewButton
              text="写真を選択"
              onSelect={() => setOpen(true)}
            />
          </div>
          {errorMessage && (
            <Box color="red" mb={2}>
              {errorMessage}
            </Box>
          )}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              onClick={back}
              style={{
                marginLeft: "auto", // 右に寄せるために margin-left を使用
                width: "100px",
                height: "44.5px",
                borderRadius: "25px",
                boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.15)", // ホバー時の影
              }}
            >
              前へ
            </Button>
            {file === null ? (
              <Button disabled={true}>
                {caller === "registration" ? "次へ" : "保存"}
              </Button>
            ) : (
              <NextButton onClick={next}>
                {caller === "registration" ? "次へ" : "保存"}
              </NextButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
