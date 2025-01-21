import { useMyID } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import EditableCoursesTable from "~/components/course/EditableCoursesTable";
import type { StepProps } from "../common";

export default function Step4({ onSave }: StepProps<void>) {
  const { state } = useMyID();
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1">
        {state.current === "loading" ? (
          <FullScreenCircularProgress />
        ) : state.current === "error" ? (
          <p>Error: {state.error.message}</p>
        ) : (
          <div className="mx-4 mt-4 flex flex-1 flex-col gap-4">
            <h1>授業情報の登録 (スキップ可)</h1>
            <div className="flex-1">
              <EditableCoursesTable userId={state.data} />
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-between p-6">
        <span />
        <button
          type="button"
          onClick={() => onSave()}
          className="btn btn-primary"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
