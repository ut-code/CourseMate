import sharp from "sharp";
import { Err, Ok, type Result } from "../../common/lib/result";

const IMAGE_SIZE_PX = 320;

export async function compressImage(buf: Buffer): Promise<Result<Buffer>> {
  try {
    return sharp(buf)
      .resize(IMAGE_SIZE_PX)
      .webp()
      .toBuffer()
      .then((buf) => Ok(buf))
      .catch((e) => Err(e));
  } catch (e) {
    return Err(e);
  }
}
