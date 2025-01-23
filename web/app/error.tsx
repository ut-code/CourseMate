"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <p>
      エラーが発生しました。ホームへ戻ってください。
      <Link href="/home">Go Back</Link>
    </p>
  );
}
