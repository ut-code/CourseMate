import { MdOutlinePowerSettingsNew } from "react-icons/md";
import NavLinks from "./nave-links";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
        // action={async () => {
        //   "use server";
        //   await signOut();
        // }}
        >
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 font-medium text-sm hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <MdOutlinePowerSettingsNew className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
