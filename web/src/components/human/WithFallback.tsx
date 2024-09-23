import { Avatar } from "@mui/material";
import { ImageFallback } from "../ImageFallback";

type Props = {
  width: string;
  height: string;
  url?: string;
};

export function AvatarWithFallback({ width, height, url }: Props) {
  return (
    <ImageFallback
      key={url}
      width={width}
      height={height}
      url={url}
      fallback={<Avatar sx={{ width: `${width}`, height: `${height}` }} />}
      alt=""
    />
  );
}
