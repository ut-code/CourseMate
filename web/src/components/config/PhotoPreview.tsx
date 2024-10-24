import { Button } from "@mui/material";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { uploadImage } from "../../api/image";
import { ImageCropper } from "../ImageCropper";
import { photo } from "../data/photo-preview";

type ButtonProps = {
  text?: string;
  onSelect: () => void;
};

// DANGER: PhotoPreview component MUST have been rendered before this button is pressed.
export function PhotoPreviewButton({ text, onSelect }: ButtonProps) {
  const inputRef: React.LegacyRef<HTMLInputElement> = useRef(null);
  return (
    <Button
      variant="contained"
      component="label"
      style={{
        backgroundColor: "#039BE5",
        color: "white",
        width: "70vw",
        maxWidth: "500px",
        height: "50px",
        marginTop: "10vh",
        fontSize: "18px",
      }}
      onClick={() => {
        if (inputRef.current) inputRef.current.value = "";
      }}
    >
      {text || "写真を選択"}
      <input
        id="file-upload"
        ref={inputRef}
        type="file"
        onChange={(e) => {
          const ok = imageSelectHandler(e);
          if (ok) {
            onSelect();
          }
        }}
        accept=".png, .jpeg, .jpg"
        style={{ display: "none" }}
      />
    </Button>
  );
}

// NOTE: this implementation is so dumb and unsafe.
// it's either I'm just being a fool, or the React system itself is wrong
// please fix this and prove that I am the fool...
let imageSelectHandler: (f: ChangeEvent<HTMLInputElement>) => boolean;

type Props = {
  prev?: string;
  onCrop?: (f: File) => void;
};

export function PhotoPreview({ prev, onCrop }: Props) {
  // url of original file
  const [url, setUrl] = useState<string | null>(prev || null);
  const [originalFile, setOriginalFile] = useState<File>();
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  // returns true if it's OK to open modal.
  const onSelectImage = useCallback(
    (event: ChangeEvent<HTMLInputElement>): boolean => {
      if (!event.target.files || event.target.files.length <= 0) {
        return false;
      }
      if (event.target.files && event.target.files.length > 0) {
        setOriginalFile(event.target.files[0]);
        return true;
      }
      return false;
    },
    [],
  );
  useEffect(() => {
    imageSelectHandler = onSelectImage;
  }, [onSelectImage]);

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
