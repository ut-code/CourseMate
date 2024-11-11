import { Slider } from "@mui/material";
import { useState } from "react";
import Cropper from "react-easy-crop";

type Props = {
  sameOriginURL: string;
  onImageChange: (data: File) => void;
};

export function ImageCropper({ sameOriginURL: url, onImageChange }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <>
      <div
        style={{
          position: "relative",
          minHeight: "300px", // TODO: make it flexible
        }}
      >
        <Cropper
          image={url}
          crop={crop}
          onCropChange={setCrop}
          zoom={zoom}
          onZoomChange={setZoom}
          aspect={1}
          cropShape="round"
          onCropComplete={(_, pix) => {
            const diff = { x: pix.x, y: pix.y };
            const size = { w: pix.width, h: pix.height };

            // not optimal performance-wise: it operates crop on every crop action.
            // better operate crop only once on save, but couldn't find a way to do it easily
            operateCrop(url, diff, size)
              .then((f) => onImageChange(f))
              .catch();
          }}
        />
      </div>
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.05}
        aria-labelledby="Zoom Level"
        onChange={(_, newVal) => {
          setZoom(Number(newVal) || 1);
        }}
      />
    </>
  );
}

// is this the right way to do this?
// https://cloudinary.com/guides/automatic-image-cropping/cropping-images-in-javascript
function operateCrop(
  srcURL: string,
  diff: { x: number; y: number },
  size: { w: number; h: number },
): Promise<File> {
  // Qiita: canvasのサイズ指定
  // canvasのデフォルトサイズは、幅300px、高さ150px。
  // https://qiita.com/ShinyaOkazawa/items/9e662bf2121548f79d5f
  //
  // Canvas.style.width and Canvas.width are two completely different things. (and so as height)
  // https://stackoverflow.com/questions/17764012/image-being-clipped-when-copied-to-html-canvas-using-drawimage

  const dest = document.createElement("canvas");
  dest.width = 640;
  dest.height = 640;
  const ctx = dest.getContext("2d");
  if (!ctx) throw new Error("this shouldn't happen");

  const src = new Image();
  src.src = srcURL;
  // TODO: downscale the image if it's too large to upload.
  ctx.drawImage(src, diff.x, diff.y, size.w, size.h, 0, 0, 640, 640);

  return new Promise((resolve) => {
    // stack overflow: JS-Convert an Image object to a jpeg file
    // https://stackoverflow.com/questions/47913980/js-convert-an-image-object-to-a-jpeg-file
    dest.toBlob(
      (blob) => {
        if (!blob) throw new Error(); // this should not happen
        const filename = `${randomString(16)}.png`;
        const file = new File([blob], filename, { type: "image/png" });
        resolve(file);
      },
      "image/png",
      1.0,
    );

    setTimeout(() => {
      src.remove();
      dest.remove();
    }, 1000);
  });
}

const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function randomString(len: number): string {
  return Array.from(Array(len))
    .map(() => pool[Math.floor(Math.random() * pool.length)])
    .join("");
}
