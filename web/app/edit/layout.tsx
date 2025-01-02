import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function EditPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="編集/Edit" />
      <div className="flex h-screen flex-col">{children}</div>
    </NavigateByAuthState>
  );
}
