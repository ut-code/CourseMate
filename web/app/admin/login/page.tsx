"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin } from "../../../api/admin/login/route";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await adminLogin(name, password);
      alert("成功しました。遷移します");
      router.replace("/admin");
    } catch (e) {
      alert("ログインに失敗しました");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center font-bold text-2xl text-gray-700">
          管理者画面 ログインページ
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your name"
            />
          </div>
          <div className="form-control">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
