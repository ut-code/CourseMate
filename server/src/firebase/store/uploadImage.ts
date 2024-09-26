import { Err, Ok, type Result } from "../../common/lib/result";
import type { GUID } from "../../common/types";
import { prisma } from "../../database/client";

// TODO: move this out of firebase/ since this is not firebase anymore.

/**
 * @throws if failed to upload image
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
      const pictureUrl = `${process.env.SERVER_ORIGIN}/pfp/${guid}?update=${new Date().getTime()}`;
      return Ok(pictureUrl);
    })
    .catch((err) => {
      console.error("Error uploading file:", err);
      return Err(err);
    });
}

export async function get(guid: GUID): Promise<Result<Buffer>> {
  return prisma.avatar
    .findUnique({
      where: { guid },
    })
    .then((res) => (res ? Ok(res.data) : Err(404)))
    .catch((e) => Err(e));
}
