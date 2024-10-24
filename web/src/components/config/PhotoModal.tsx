import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import { MAX_IMAGE_SIZE, uploadImage } from "../../api/internal/fetch-func";
import { PhotoPreview } from "./PhotoPreview";

async function upload(
  file: File,
  afterUpload: (url: string) => void,
  onError: (err: Error) => void,
) {
  try {
    if (!file) throw new Error("画像は入力必須です");
    if (file.size >= MAX_IMAGE_SIZE) {
      return onError(new Error("画像が大きすぎます"));
    }
    const url = await uploadImage(file);
    console.log("new URL:", url);
    afterUpload(url);
  } catch (err) {
    console.error(err);
    onError(err as Error);
  }
}

type Props = {
  open: boolean;
  prevUrl?: string;
  closeFunc: () => void;
  afterUpload: (url: string) => void;
  onError: (e: Error) => void;
};
export default function PhotoModal({
  open,
  prevUrl,
  closeFunc,
  afterUpload,
  onError,
}: Props) {
  const [cropped, setCropped] = useState<File | null>(null);
  return (
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
          prev={prevUrl}
          onCrop={(f) => {
            setCropped(f);
          }}
        />
        <Button
          sx={{ float: "right", marginRight: "30px" }}
          variant="contained"
          onClick={async () => {
            try {
              if (cropped === null) throw new Error("画像は必須です");
              if (cropped.size >= MAX_IMAGE_SIZE)
                throw new Error("画像が大きすぎます");
              try {
                await upload(cropped, afterUpload, onError);
              } catch (e) {
                console.error(e);
                throw new Error("画像のアップロードに失敗しました");
              }
              closeFunc();
            } catch (err) {
              onError(err as Error);
            }
          }}
        >
          切り取って保存
        </Button>
        <Button
          sx={{ float: "right", marginRight: "30px" }}
          onClick={async () => {
            try {
              closeFunc();
            } catch (err) {
              onError(err as Error);
            }
          }}
        >
          キャンセル
        </Button>
      </Box>
    </Modal>
  );
}
