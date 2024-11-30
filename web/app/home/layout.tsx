import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="ホーム/Home" />
      <div className="relative top-14 right-0 bottom-14 left-0 overflow-y-auto sm:top-16">
        {children}
      </div>
      <BottomBar activeTab="0_home" />
    </>
  );
}
