import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="ホーム/Home" />
      <div className="grow overflow-y-auto ">{children}</div>
      <BottomBar activeTab="0_home" />
    </NavigateByAuthState>
  );
}
