import app from "../server/src/index";
type Config = Omit<RequestInit, "method">;

export async function GET<T extends string>(path: T, config?: Config) {
  return await app.request(path, {
    ...config,
  });
}
export async function POST<T extends string>(path: T, config?: Config) {
  return await app.request(path, {
    method: "POST",
    ...config,
  });
}
export async function PUT<T extends string>(path: T, config?: Config) {
  return await app.request(path, {
    method: "PUT",
    ...config,
  });
}
export async function PATCH<T extends string>(path: T, config?: Config) {
  return await app.request(path, {
    method: "PATCH",
    ...config,
  });
}
export async function DELETE<T extends string>(path: T, config?: Config) {
  return await app.request(path, {
    method: "DELETE",
    ...config,
  });
}
