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
      <div className="absolute top-14 right-0 bottom-14 left-0 overflow-y-auto sm:top-16">
        {children}
      </div>
      <BottomBar activeTab="4_settings" />
    </>
  );
}
