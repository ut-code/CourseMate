import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="検索" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="h-full overflow-y-auto pt-12 pb-12">{children}</div>
      </NavigateByAuthState>
      <BottomBar activeTab="2_search" />
    </>
  );
}
