import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import TopNavigation from "~/components/common/TopNavigation";

// Notification型を定義
type Notification = {
  date: string; // お知らせの日付 (例: "2024-12-15")
  title: string; // お知らせのタイトル (例: "システムメンテナンスのお知らせ")
  content: string; // お知らせの内容 (例: "2024年12月20日午後2時より...")
};

// お知らせリスト
const notifications: Notification[] = [
  {
    date: "2024-12-28",
    title: "CourseMate Ver2.0.0リリースのお知らせ",
    content: "検索機能など、新たな機能を実装しました。ぜひご活用ください。",
  },
  {
    date: "2024-10-9",
    title: "CourseMate Ver1.0.1リリースのお知らせ",
    content: "授業登録モーダルにおいて、授業IDを追加しました。",
  },
  {
    date: "2024-10-1",
    title: "CourseMate リリースのお知らせ",
    content: "CourseMateがリリースされました！ぜひご活用ください。",
  },
];

// 日付の降順（最近の順）で並べ替え
const sortedNotifications = notifications.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function Notification() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex flex-col p-2">
        <TopNavigation title="お知らせ" />

        <ul className="w-full space-y-6 p-8 text-left">
          {sortedNotifications.map((notification) => (
            <li key={notification.date} className="border-b pb-4">
              <h2 className="font-semibold text-lg">{notification.title}</h2>
              <p className="text-gray-500 text-sm">{notification.date}</p>
              <p className="mt-2 leading-7">{notification.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </NavigateByAuthState>
  );
}
