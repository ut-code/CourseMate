import { Err, Ok, type Result } from "../../../common/lib/result";

export async function safeFetch(
  path: string,
  method: string,
): Promise<Result<Response>> {
  try {
    return Ok(
      await fetch(path, {
        method: method,
      }),
    );
  } catch (e) {
    return Err(e);
  }
}

import { getIdToken } from "../../firebase/auth/lib";
import endpoints from "./endpoints";

type URL = string;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: File): Promise<URL> {
  if (file.size >= MAX_IMAGE_SIZE) {
    throw new Error("画像のアップロードに失敗しました: 画像が大きすぎます");
  }
  const res = await fetch(`${endpoints.picture}?token=${await getIdToken()}`, {
    method: "POST",
    headers: {
      "Content-Type": "image/png",
    },
    body: file,
  });
  if (res.status !== 201)
    throw new Error(
      `Unexpected status code: expected 201, but got ${res.status}`,
    );
  return await res.text();
}
