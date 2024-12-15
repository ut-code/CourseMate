"use client";
import { useEffect, useState } from "react";

// モックデータ
const mockNotifications = [
  {
    id: 1,
    title: "システムメンテナンス",
    content: "12月20日にシステムメンテナンスを行います。",
  },
  {
    id: 2,
    title: "新機能リリース",
    content: "新しい機能がリリースされました。",
  },
];

// 型定義
type Notification = {
  id: number;
  title: string;
  content: string;
};

export default function NotificationAdmin() {
  // useStateに型を明示的に指定
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [form, setForm] = useState<Notification>({
    id: 0,
    title: "",
    content: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 初期データを設定
    setNotifications(mockNotifications);
  }, []);

  // 入力フォームの変更処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 新しいお知らせを追加
  const handleAdd = () => {
    if (!form.title || !form.content)
      return alert("タイトルと内容を入力してください");
    const newNotification: Notification = { ...form, id: Date.now() };
    setNotifications([...notifications, newNotification]);
    setForm({ id: 0, title: "", content: "" });
  };

  // お知らせを編集
  const handleEdit = (notification: Notification) => {
    setIsEditing(true);
    setForm(notification);
  };

  // 編集内容を保存
  const handleUpdate = () => {
    if (!form.title || !form.content)
      return alert("タイトルと内容を入力してください");
    setNotifications(
      notifications.map((n) => (n.id === form.id ? { ...form } : n)),
    );
    setForm({ id: 0, title: "", content: "" });
    setIsEditing(false);
  };

  // お知らせを削除
  const handleDelete = (id: number) => {
    if (window.confirm("本当に削除しますか？")) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 font-bold text-2xl">お知らせ配信</h1>

      {/* 一覧表示 */}
      <div className="mb-6">
        <h2 className="mb-2 font-semibold text-xl">お知らせ一覧</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">タイトル</th>
              <th className="px-4 py-2 text-left">内容</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id} className="border-b">
                <td className="px-4 py-2">{notification.title}</td>
                <td className="px-4 py-2">{notification.content}</td>
                <td className="px-4 py-2 text-center">
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    className="mr-2 text-blue-600"
                    onClick={() => handleEdit(notification)}
                  >
                    編集
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(notification.id)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* フォーム */}
      <div>
        <h2 className="mb-2 font-semibold text-xl">
          {isEditing ? "お知らせを編集" : "新しいお知らせを作成"}
        </h2>
        <div className="mb-4">
          {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="block mb-2">タイトル</label>
          <input
            className="w-full rounded border px-4 py-2"
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="mb-2 block">内容</label>
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <textarea
            className="w-full rounded border px-4 py-2"
            name="content"
            value={form.content}
            onChange={handleInputChange}
          ></textarea>
        </div>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={isEditing ? handleUpdate : handleAdd}
        >
          {isEditing ? "更新" : "追加"}
        </button>
      </div>
    </div>
  );
}
