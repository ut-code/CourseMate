import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { name, password } = body;
  console.log("あああ", body);
  if (name === "admin" && password === "password123") {
    // 認証成功時にCookieを設定
    const cookie = serialize("authToken", "admin-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1日
    });

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", cookie);
    return response;
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
