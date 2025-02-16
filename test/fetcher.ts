import app from "../server/src/index";
type Config = Omit<RequestInit, "method">;
function prefix(path: string): string {
  if (path.at(0) === "/") return `localhost:3000${path}`;
  return path;
}

export async function GET(path: string, config?: Config) {
  return await app.request(prefix(path), {
    ...config,
  });
}
export async function POST(path: string, config?: Config) {
  return await app.request(prefix(path), {
    method: "POST",
    ...config,
  });
}
export async function PUT(path: string, config?: Config) {
  return await app.request(prefix(path), {
    method: "PUT",
    ...config,
  });
}
export async function PATCH(path: string, config?: Config) {
  return await app.request(prefix(path), {
    method: "PATCH",
    ...config,
  });
}
export async function DELETE(path: string, config?: Config) {
  return await app.request(prefix(path), {
    method: "DELETE",
    ...config,
  });
}
