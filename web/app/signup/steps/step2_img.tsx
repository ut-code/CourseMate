import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import type { BackProp, StepProps } from "~/app/signup/common";
import PhotoModal from "~/components/config/PhotoModal";
import { PhotoPreviewButton } from "~/components/config/PhotoPreview";
import UserAvatar from "~/components/human/avatar";

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
      <div className="g-2 flex flex-col p-2">
        <h1 className="text-xl">プロフィール画像設定(2/5)</h1>
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
      </div>
      <div className="fixed bottom-0 flex w-full justify-between p-6">
        <button type="button" onClick={back} className="btn">
          前へ
        </button>
        <button type="button" onClick={next} className="btn btn-primary">
          {caller === "registration" ? "次へ" : "保存"}
        </button>
      </div>
    </>
  );
}
