import Link from "next/link";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function TutorialPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="チュートリアル/Tutorial" />
      <div className="grow">{children}</div>
      <div className="m-4 text-center">
        <Link href="/home" className="btn btn-primary w-full">
          ホーム画面へ
        </Link>
      </div>
    </NavigateByAuthState>
  );
}
