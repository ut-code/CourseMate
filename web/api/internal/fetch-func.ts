import { getIdToken } from "~/firebase/auth/lib";

type URL = string;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(path: string, file: File): Promise<URL> {
  if (file.size >= MAX_IMAGE_SIZE) {
    throw new Error("画像のアップロードに失敗しました: 画像が大きすぎます");
  }
  const res = await fetch(`${path}?token=${await getIdToken()}`, {
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
