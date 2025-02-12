"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSetHeaderFooter({}, { activeTab: "0_home" });
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="h-full pt-12 pb-12">{children}</div>
    </NavigateByAuthState>
  );
}
