"use client";

import { useAboutMe } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import EditableCoursesTable from "~/components/course/EditableCoursesTable";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function EditCourses() {
  const { state } = useAboutMe();
  const data = state.data;
  const loading = state.current === "loading";
  const error = state.current === "error" ? state.error : null;

  if (error) throw error;

  useSetHeaderFooter(
    { title: "授業", backButtonPath: "/settings" },
    { activeTab: "4_settings" },
  );

  return (
    <div className="my-0 flex h-full max-w-[350] flex-col p-2 text-center">
      {loading ? (
        <FullScreenCircularProgress />
      ) : data ? (
        <div className="flex-1 p-2">
          <EditableCoursesTable userId={data.id} />
        </div>
      ) : (
        <p>データがありません。</p>
      )}
    </div>
  );
}
