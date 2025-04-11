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
      <Header />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="cm-pb-footer h-full pt-12">{children}</div>
      </NavigateByAuthState>
      <BottomBar activeTab="0_home" />
    </>
  );
}
