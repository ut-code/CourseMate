import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="検索/Search" />
      <div className="grow overflow-y-auto">{children}</div>
      <BottomBar activeTab="2_search" />
    </>
  );
}
