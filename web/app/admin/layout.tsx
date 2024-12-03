import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="管理者画面/Admin" />
      <div className="absolute top-14 right-0 bottom-14 left-0 overflow-y-auto sm:top-16">
        {children}
      </div>
    </NavigateByAuthState>
  );
}
