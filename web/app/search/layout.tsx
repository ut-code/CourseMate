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
      <Header title="検索/Search" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="grow overflow-y-auto">{children}</div>
      </NavigateByAuthState>
      <BottomBar activeTab="2_search" />
    </>
  );
}
