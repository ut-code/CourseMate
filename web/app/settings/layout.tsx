"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSetHeaderFooter({ title: "設定" }, { activeTab: "4_settings" });
  return (
    <>
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="h-full overflow-y-auto pt-12 pb-12">{children}</div>
      </NavigateByAuthState>
    </>
  );
}
