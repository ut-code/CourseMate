"use client";

import type { InterestSubject } from "common/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div className="overflow-y-scroll">
      <div className="h-full">
        <ul>
          {draftSubjects.map((subject, index) => (
            <li key={subject.id}>
              {subject.name}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() =>
                  setDraftSubjects((prev) => {
                    const copy = [...prev];
                    copy.splice(index, 1);
                    return copy;
                  })
                }
              >
                x
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <ul>
          {searchResult.map((subject) => (
            <li key={subject.id}>
              {subject.name}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setDraftSubjects((prev) => [...prev, subject])}
              >
                +
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
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
