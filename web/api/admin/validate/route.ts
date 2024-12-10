import { parse } from "cookie";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookies = parse(request.headers.get("cookie") || "");
  console.log("こんにちは", cookies);

  if (cookies.authToken === "admin-token") {
    return NextResponse.json({ isAuthenticated: true });
  }

  return NextResponse.json({ isAuthenticated: false }, { status: 401 });
}
