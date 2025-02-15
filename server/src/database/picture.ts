import { panic } from "common/lib/panic";
import type { GUID } from "common/types";
import { prisma } from "./client";

/**
 * @returns URL of the uploaded file.
 * @throws on database conn fail.
 **/
export async function uploadPic(
  hash: string,
  buf: Buffer,
  passkey: string,
): Promise<string> {
  await prisma.picture.upsert({
    where: { hash },
    create: { hash, data: buf, key: passkey },
    update: { data: buf, key: passkey },
  });
  const url = `/picture/${hash}?key=${passkey}`;
  return url;
}

export async function getPic(hash: string, passkey: string) {
  return prisma.picture
    .findUnique({
      where: {
        hash,
        key: passkey,
      },
    })
    .then((val) => val?.data);
}

/**
 * is safe to await.
 * @returns URL of the file.
 **/
export async function setProf(guid: GUID, buf: Buffer): Promise<string> {
  return prisma.avatar
    .upsert({
      where: {
        guid,
      },
      create: { guid, data: buf },
      update: { data: buf },
    })
    .then(() => {
      // ?update=${date} is necessary to let the browsers properly cache the image.
      const pictureUrl = `/picture/profile/${guid}?update=${new Date().getTime()}`;
      return pictureUrl;
    });
}

// is await-safe.
export async function getProf(guid: GUID): Promise<Buffer> {
  return prisma.avatar
    .findUnique({
      where: { guid },
    })
    .then((res) => res?.data ?? panic("not found"));
}
