"use client";

import type { InterestSubject } from "common/types";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { useAlert } from "~/components/common/alert/AlertProvider";
import * as subject from "../../../api/subject";

export default function EditInterest() {
  const { state } = subject.useMyInterests();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";

  const router = useRouter();
  const { showAlert } = useAlert();

  const [allSubjects, setAllSubjects] = useState<InterestSubject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<InterestSubject[]>(
    [],
  );
  const [draftSubjects, setDraftSubjects] = useState<InterestSubject[]>(
    data ?? [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    setDraftSubjects(data ?? []);
  }, [data]);

  async function getSubjects() {
    const subjects = await subject.getAll();
    setAllSubjects(subjects);
    setFilteredSubjects(subjects);
  }

  async function updateInterests(data: {
    interestSubjects: InterestSubject[];
  }) {
    const ids = data.interestSubjects.map((d) => d.id);
    const result = await subject.update(ids);
    if (!result.ok) {
      enqueueSnackbar("興味分野の保存に失敗しました", { variant: "error" });
    } else {
      enqueueSnackbar("興味分野を保存しました", { variant: "success" });
    }
  }

  async function createSubject(name: string) {
    const result = await subject.create(name);
    if (!result.ok) {
      enqueueSnackbar("興味分野の作成に失敗しました", { variant: "error" });
    } else {
      enqueueSnackbar("興味分野を作成しました", { variant: "success" });
    }
  }

  function handleBack() {
    // TODO: 差分がないときは確認なしで戻る
    showAlert({
      AlertMessage: "変更がある場合は、破棄されます。",
      subAlertMessage: "本当にページを移動しますか？",
      yesMessage: "移動",
      clickYes: () => {
        router.push("/settings/profile");
      },
    });
  }

  return loading ? (
    <FullScreenCircularProgress />
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : !data ? (
    <p>データがありません。</p>
  ) : (
    <>
      <div className="h-full overflow-y-scroll">
        <div className="mx-auto flex h-full max-w-lg flex-col px-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 p-2">
              {draftSubjects.map((subject, index) => (
                <span
                  key={subject.id}
                  className="rounded-md bg-[#F7FCFF] px-2 py-1 text-md text-primary"
                >
                  #{subject.name}
                  <button
                    type="button"
                    className="btn btn-circle btn-xs ml-1"
                    onClick={() =>
                      setDraftSubjects((prev) => {
                        const copy = [...prev];
                        copy.splice(index, 1);
                        return copy;
                      })
                    }
                  >
                    <MdClose className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 w-full">
              <input
                type="text"
                onChange={(e) => {
                  const newFilteredSubjects = allSubjects.filter((subject) =>
                    subject.name.includes(e.target.value.trim()),
                  );
                  setFilteredSubjects(newFilteredSubjects);
                }}
                placeholder="興味分野タグを絞り込み"
                className="input input-bordered w-full"
              />
            </div>
            <ul className="mt-2">
              {filteredSubjects.length !== 0 ? (
                filteredSubjects
                  .filter(
                    (subject) =>
                      !draftSubjects.some((draft) => draft.id === subject.id),
                  )
                  .map((subject) => (
                    <li key={subject.id}>
                      <button
                        type="button"
                        className="btn btn-ghost inline-flex h-full w-full justify-start p-2"
                        onClick={() =>
                          setDraftSubjects((prev) => [...prev, subject])
                        }
                      >
                        <span className="font-normal text-lg">
                          #{subject.name}
                        </span>
                      </button>
                    </li>
                  ))
              ) : (
                <li key="empty" className="p-2 text-gray-500">
                  検索結果がありません
                </li>
              )}
              <li className="flex w-full items-center justify-center py-2">
                <button
                  type="button"
                  className="btn btn-secondary px-6 font-normal"
                  onClick={() => setIsOpen(true)}
                >
                  <MdAdd />
                  タグを新規作成
                </button>
              </li>
            </ul>
          </div>
          <div className="my-2 flex justify-between">
            <button type="button" className="btn btn-sm" onClick={handleBack}>
              設定画面に戻る
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                updateInterests({ interestSubjects: draftSubjects });
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <dialog
          id="add-dialog"
          className="modal modal-open"
          onClose={() => setIsOpen(false)}
        >
          <div className="modal-box">
            <h3 className="mb-4 font-bold text-lg">興味分野タグの作成</h3>
            <input
              type="text"
              className="input input-bordered my-2 w-full"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="タグ名を入力"
            />
            {newSubjectName && (
              <p className="py-4">
                興味分野タグ{" "}
                <span className="text-primary">#{newSubjectName}</span>{" "}
                を作成します
              </p>
            )}
            <div className="modal-action">
              <form method="dialog">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsOpen(false);
                      setNewSubjectName("");
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={async () => {
                      await createSubject(newSubjectName);
                      setIsOpen(false);
                      getSubjects();
                      setNewSubjectName("");
                    }}
                  >
                    作成
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
