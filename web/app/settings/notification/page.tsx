import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import TopNavigation from "~/components/common/TopNavigation";

export default function Notification() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex flex-col p-2">
        <TopNavigation title="お知らせ" />
        <ul className="w-full p-8 text-left">
          <li className="mb-4 leading-7">お知らせです</li>
        </ul>
      </div>
    </NavigateByAuthState>
  );
}
