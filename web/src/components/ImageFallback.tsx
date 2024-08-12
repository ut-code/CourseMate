import { useState } from "react";

type Props = {
  url?: string;
  fallback: React.ReactElement;
  width: string;
  height: string;
};

// https://medium.com/@abhishekmicosoft/handling-img-fallback-307653b2f30
export function ImageFallback({ width, height, url, fallback }: Props) {
  const [isError, setIsError] = useState<boolean>(false);

  return isError ? (
    <img
      src={url}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
      onError={() => setIsError(true)}
    />
  ) : (
    <>{fallback}</>
  );
}
