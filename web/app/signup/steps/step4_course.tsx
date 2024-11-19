import Link from "next/link";
import { useMyID } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import EditableCoursesTable from "~/components/course/EditableCoursesTable";

export default function Step4() {
  const { state } = useMyID();
  return (
    <>
      <div>
        {state.current === "loading" ? (
          <FullScreenCircularProgress />
        ) : state.current === "error" ? (
          <p>Error: {state.error.message}</p>
        ) : (
          <div className="mx-4 mt-4 flex flex-col gap-4">
            <h1>授業情報の登録 (スキップ可)</h1>
            <div>
              <EditableCoursesTable userId={state.data} />
            </div>
          </div>
        )}
      </div>
      <div className="b-0 fixed flex w-full justify-between p-6">
        <span />
        <Link href="/tutorial" className="btn btn-primary">
          次へ
        </Link>
      </div>
    </>
  );
}
