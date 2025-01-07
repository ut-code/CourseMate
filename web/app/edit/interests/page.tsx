"use client";

import type { InterestSubject } from "common/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { useAlert } from "~/components/common/alert/AlertProvider";
import { search, update, useMyInterests } from "../../../api/subject";

export default function EditInterest() {
  const { state } = useMyInterests();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";

  const router = useRouter();
  const { showAlert } = useAlert();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<InterestSubject[]>([]);

  const [draftSubjects, setDraftSubjects] = useState<InterestSubject[]>(
    data ?? [],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      if (searchQuery) {
        const result = await search(searchQuery);
        setSearchResult(result);
      } else {
        setSearchResult([]);
      }
    })();
  }, [searchQuery]);

  useEffect(() => {
    setDraftSubjects(data ?? []);
  }, [data]);

  async function submit(data: { interestSubjects: InterestSubject[] }) {
    const ids = data.interestSubjects.map((d) => d.id);
    await update(ids);
  }

  function handleBack() {
    // TODO: 差分がないときは確認なしで戻る
    showAlert({
      AlertMessage: "編集中のフィールド、もしくはエラーがあります。",
      subAlertMessage: "本当にページを移動しますか？変更は破棄されます",
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="興味分野タグを検索"
              className="input input-bordered w-full"
            />
          </div>
          <ul className="mt-2">
            {searchResult.length !== 0 ? (
              searchResult
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
                {searchQuery
                  ? "検索結果がありません"
                  : "興味分野を検索してみましょう"}
              </li>
            )}
            <li className="flex w-full items-center justify-center py-2">
              <button
                type="button"
                className="btn btn-secondary px-6 font-normal"
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
              submit({ interestSubjects: draftSubjects });
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
