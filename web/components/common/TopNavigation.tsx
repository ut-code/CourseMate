import Link from "next/link";
import { MdOutlineArrowBack } from "react-icons/md";

type TopNavigationProps = {
  title: string;
};

/**
 * Settings の子ページから Setting に戻るナビゲーションを提供
 */
export default function TopNavigation({ title }: TopNavigationProps) {
  return (
    <div
      className="flex items-center py-2"
      style={{
        // Main profile-specific styling for dynamic height calculation
        height: "min(56px, calc(100dvh - 70dvh - 56px - 56px - 16px - 36px))",
      }}
    >
      <Link href="/settings" passHref>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button className="btn btn-ghost btn-circle">
          <MdOutlineArrowBack size={24} />
        </button>
      </Link>
      <h1
        className="-translate-x-1/2 absolute left-1/2 transform overflow-hidden text-ellipsis whitespace-nowrap font-bold text-lg"
        style={{
          // Center-align the title text due to the left-only arrow
          maxWidth: "calc(100% - 64px)", // Prevents the title from overflowing the arrow button
        }}
      >
        {title}
      </h1>
    </div>
  );
}
