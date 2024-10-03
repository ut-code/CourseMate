import { Err, Ok, type Result } from "../common/lib/result";
import type { GUID } from "../common/types";
import { prisma } from "./client";

/**
 * is safe to await.
 * @returns URL of the file.
 **/
export async function set(guid: GUID, buf: Buffer): Promise<Result<string>> {
  return prisma.avatar
    .upsert({
      where: {
        guid: guid,
      },
      create: { guid, data: buf },
      update: { data: buf },
    })
    .then(() => {
      // ?update=${date} is necessary to let the browsers properly cache the image.
      const pictureUrl = `/picture/${guid}?update=${new Date().getTime()}`;
      return Ok(pictureUrl);
    })
    .catch((err) => {
      console.error("Error uploading file:", err);
      return Err(err);
    });
}

// is await-safe.
export async function get(guid: GUID): Promise<Result<Buffer>> {
  return prisma.avatar
    .findUnique({
      where: { guid },
    })
    .then((res) => (res ? Ok(res.data) : Err(404)))
    .catch((err) => {
      console.log("Error reading db: ", err);
      return Err(err);
    });
}
