"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useAll, useMatched, useMyID, usePendingFromMe } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import Search from "~/components/search/search";
import Table from "~/components/search/table";
import BackgroundText from "../../components/common/BackgroundText";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [query, setQuery] = useState<string>(searchParams?.query ?? "");

  const {
    state: { data },
  } = useAll();
  const {
    state: { data: myId },
  } = useMyID();
  const initialData = useMemo(() => {
    return data?.filter((item) => item.id !== myId && item.id !== 0) ?? null;
  }, [data, myId]);

  const {
    state: { data: matches },
  } = useMatched();

  const {
    state: { data: pending },
  } = usePendingFromMe();

  if (!initialData) {
    return <FullScreenCircularProgress />;
  }
  // リクエストを送ってない人のみリクエスト送信可能
  // FIXME: O(n^2) | n = count(users) なのでめっちゃ計算コストかかる。なんとかして。
  const canRequest = (userId: number) =>
    !matches?.some((match) => match.id === userId) &&
    !pending?.some((pending) => pending.id === userId);

  // this is very expensive. someone fix this pls
  const users = initialData?.filter(
    (user) =>
      query === "" ||
      user.name.includes(query) ||
      user.interestSubjects.some((i) => i.name.includes(query)) ||
      user.courses.some((c) => c.name.includes(query)),
  );

  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4">
      <Search placeholder="検索" setSearchString={setQuery} />
      <div className="flex-1">
        {query !== "" ? (
          users.length > 0 ? (
            <Table users={users} canRequest={canRequest} />
          ) : (
            <BackgroundText text="ユーザが見つかりません" />
          )
        ) : (
          <BackgroundText text="ユーザ名・授業名・タグ名で検索してみましょう" />
        )}
      </div>
    </div>
  );
}
