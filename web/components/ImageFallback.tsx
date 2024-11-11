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
    <object
      data={URL}
      type="image/webp"
      width={width} // there probably prevent style shaking
      height={height}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    >
      <img
        src="/avatar-fallback.webp"
        width={width}
        height={height}
        style={{ width, height }}
        alt=""
      />
    </object>
  );
}
