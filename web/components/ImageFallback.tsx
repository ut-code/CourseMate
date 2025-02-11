"use client";
type Props = {
  url?: string;
  fallback: React.ReactElement;
  width: string;
  height: string;
};

// https://medium.com/@abhishekmicosoft/handling-img-fallback-307653b2f30
export function ImageFallback({ width, height, url }: Props) {
  const URL = url?.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`
    : url;

  return (
    <img
      src={URL}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/avatar.svg";
      }}
      width={width}
      height={height}
      style={{ width, height, borderRadius: "50%" }}
      alt=""
    />
  );
}
