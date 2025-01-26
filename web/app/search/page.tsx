"use client";

import { useMemo, useState } from "react";
import { useAll, useMatched, useMyID, usePendingFromMe } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import Search from "~/components/search/search";
import Table from "~/components/search/table";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const [query, setQuery] = useState<string>((await searchParams)?.query ?? "");

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
    <div className="flex min-h-screen justify-center ">
      <div className="w-full">
        <h2 className="m-5 mb-4 font-bold text-2xl">ユーザー検索</h2>
        <Search placeholder="検索" setSearchString={setQuery} />
        {users ? (
          <Table users={users} canRequest={canRequest} />
        ) : (
          <span>ユーザーが見つかりません</span>
        )}
      </div>
    </div>
  );
}
