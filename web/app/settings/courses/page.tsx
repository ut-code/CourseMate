"use client";

import Link from "next/link";
import { useAboutMe } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import EditableCoursesTable from "~/components/course/EditableCoursesTable";

export default function EditCourses() {
  const { state } = useAboutMe();
  const data = state.data;
  const loading = state.current === "loading";
  const error = state.current === "error" ? state.error : null;

  if (error) throw error;

  return (
    <div className="my-0 flex h-full max-w-[350] flex-col p-2 text-center">
      <h1 className="mb-2 text-xl">授業編集</h1>
      {loading ? (
        <FullScreenCircularProgress />
      ) : data ? (
        <div className="flex-1 p-2">
          <EditableCoursesTable userId={data.id} />
        </div>
      ) : (
        <p>データがありません。</p>
      )}
      <div className="mt-5 flex justify-between">
        <Link href="/settings" className="btn">
          設定画面に戻る
        </Link>
      </div>
    </div>
  );
}
