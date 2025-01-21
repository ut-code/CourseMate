import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="設定/Settings" />
      <div className="grow overflow-y-auto">{children}</div>
      <BottomBar activeTab="4_settings" />
    </>
  );
}
