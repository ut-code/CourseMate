import { getIdToken } from "../auth/lib";

type URL = string;
// todo: move this to api/internal/endpoints.ts
const PFP_POST_ENDPOINT = "http://localhost:3000/pfp";

// and this to api/
export async function uploadImage(file: File): Promise<URL> {
  console.log("sending image to server...");
  const res = await fetch(`${PFP_POST_ENDPOINT}?token=${await getIdToken()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });
  if (res.status !== 201)
    throw new Error(
      `Unexpected status code: expected 201, but got ${res.status}`,
    );
  return await res.text();
}
