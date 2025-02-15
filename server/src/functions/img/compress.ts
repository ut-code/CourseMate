import sharp from "sharp";

const IMAGE_SIZE_PX = 320;

export async function compressImage(buf: Buffer): Promise<Buffer> {
  return sharp(buf).resize(IMAGE_SIZE_PX).webp().toBuffer();
}
