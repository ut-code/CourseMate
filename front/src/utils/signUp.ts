import { router } from "expo-router";

const signUp = async (
  uid: string,
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  console.log("こんにちは");
  try {
    // ユーザー登録のためのAPIコール
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        name,
        email,
        password,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to sign up");
    }
    const data = await response.json();
    console.log("User registered successfully:", data);
    router.push("/home");
  } catch (error) {
    console.error("Error during sign-up:", error);
    console.log("サインアップに失敗しました");
    router.replace("/");
    console.log("リダイレクトしました。");
  }
};

export default signUp;
