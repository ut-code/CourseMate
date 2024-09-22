import { Button } from "@mui/material";
import { type ChangeEvent, useEffect, useState } from "react";
import { uploadImage } from "../../firebase/store/photo";
import { ImageCropper } from "../ImageCropper";
import { photo } from "../data/photo-preview";

const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

type ButtonProps = {
  text?: string;
  onSelect: () => void;
};

// DANGER: PhotoPreview component MUST have been rendered before this button is pressed.
export function PhotoPreviewButton({ text, onSelect }: ButtonProps) {
  return (
    <Button>
      <label htmlFor="file-upload" className="custom-file-label">
        {text || "写真を選択"}
        <input
          id="file-upload"
          type="file"
          onChange={(e) => {
            imageSelectHandler(e);
            onSelect();
          }}
          accept=".png, .jpeg, .jpg"
          style={{ display: "none" }} // ? how does this even work?
        />
      </label>
    </Button>
  );
}

// NOTE: this implementation is so dumb and unsafe.
// it's either I'm just being a fool, or the React system itself is wrong
// please fix this and prove that I am the fool...
let imageSelectHandler: (f: ChangeEvent<HTMLInputElement>) => void;

type Props = {
  prev?: string;
  onCrop?: (f: File) => void;
};

export function PhotoPreview({ prev, onCrop }: Props) {
  // url of original file
  const [url, setUrl] = useState<string | null>(prev || null);
  const [originalFile, setOriginalFile] = useState<File>();
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files || event.target.files.length <= 0) {
      return;
    }
    if (event.target.files[0].size > MAX_SIZE_IN_BYTES) {
      alert(
        "ファイルサイズが大きすぎます。5MB以下の画像をアップロードしてください。",
      );
      return;
    }
    if (event.target.files && event.target.files.length > 0) {
      setOriginalFile(event.target.files[0]);
    }
  }
  imageSelectHandler = handleImageChange;

  useEffect(() => {
    if (!croppedFile) return;
    photo.upload = async () => await uploadImage(croppedFile);
    if (onCrop) {
      onCrop(croppedFile);
    }
  }, [croppedFile, onCrop]);

  useEffect(() => {
    if (!originalFile) return;
    setCroppedFile(originalFile);

    // src: https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
    // create the preview
    const url = URL.createObjectURL(originalFile);
    setUrl(url);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(url);
  }, [originalFile]);

  return (
    <>
      {url?.startsWith("blob:") && (
        <ImageCropper sameOriginURL={url} onImageChange={setCroppedFile} />
      )}
    </>
  );
}
