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
      <div className="absolute top-14 right-0 left-0 overflow-y-auto sm:top-16">
        {children}
      </div>
    </NavigateByAuthState>
  );
}
