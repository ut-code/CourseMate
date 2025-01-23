import Link from "next/link";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="チュートリアル" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="h-full overflow-y-auto pt-12 pb-12">{children}</div>
      </NavigateByAuthState>
      <div className="m-4 text-center">
        <Link href="/home" className="btn btn-primary w-full">
          ホーム画面へ
        </Link>
      </div>
    </>
  );
}
