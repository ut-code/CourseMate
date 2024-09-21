import { useState } from "react";

type Props = {
  url?: string;
  fallback: React.ReactElement;
  width: string;
  height: string;
  alt: string;
};

// https://medium.com/@abhishekmicosoft/handling-img-fallback-307653b2f30
export function ImageFallback({ width, height, url, fallback, alt }: Props) {
  const [ok, setOK] = useState<boolean>(true);

  return ok ? (
    <img
      src={url}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
      onError={() => setOK(false)}
      alt={alt}
    />
  ) : (
    <>{fallback}</>
  );
}
