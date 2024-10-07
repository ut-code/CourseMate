import { Box, Button, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import PhotoModal from "../../../components/config/PhotoModal";
import { PhotoPreviewButton } from "../../../components/config/PhotoPreview";
import UserAvatar from "../../../components/human/avatar";
import type { BackProp, StepProps } from "../common";

export type Step2Data = {
  pictureUrl: string;
};

export default function Step2({
  onSave,
  prev,
  back,
  caller,
}: StepProps<Step2Data> & BackProp) {
  const [url, setURL] = useState<string>(prev?.pictureUrl ?? "");
  const notify = useCallback((message: string) => {
    enqueueSnackbar(message, {
      variant: "error",
    });
  }, []);

  async function next() {
    if (!url) {
      notify("画像は必須です");
      return;
    }
    const data = {
      pictureUrl: url,
    };

    onSave(data);
  }

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Box m={2} display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="h6" component="h1">
          アイコンを設定
        </Typography>

        <div style={{ textAlign: "center", marginTop: "15vh" }}>
          <PhotoModal
            open={open}
            prevUrl={prev?.pictureUrl}
            closeFunc={() => setOpen(false)}
            afterUpload={(url) => setURL(url)}
            onError={(err) =>
              notify(err?.message ?? "画像のアップロードに失敗しました")
            }
          />
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
          </div>
        </div>
      </Box>
      <Box
        p={3}
        sx={{
          position: "fixed",
          display: "flex",
          justifyContent: "space-between",
          bottom: 0,
          width: "100%",
        }}
      >
        <Button onClick={back} variant="text">
          前へ
        </Button>
        <Button onClick={next} variant="contained">
          {caller === "registration" ? "次へ" : "保存"}
        </Button>
      </Box>
    </>
  );
}
