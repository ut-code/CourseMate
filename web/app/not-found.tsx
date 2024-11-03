import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>お探しのページは見つかりませんでした。</h1>
      <Link href="/home">戻る</Link>
    </>
  );
}
