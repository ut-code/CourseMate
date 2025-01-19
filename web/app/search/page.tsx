"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useAll, useMatched, useMyID, usePendingFromMe } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import Search from "~/components/search/search";
import Table from "~/components/search/table";

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
  const users = query
    ? initialData?.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      )
    : initialData;

  const {
    state: { data: matches },
  } = useMatched();

  const {
    state: { data: pending },
  } = usePendingFromMe();

  // リクエストを送ってない人のみリクエスト送信可能
  // FIXME: O(n^2) | n = count(users) なのでめっちゃ計算コストかかる。なんとかして。
  const canRequest = (userId: number) =>
    !matches?.some((match) => match.id === userId) &&
    !pending?.some((pending) => pending.id === userId);

  const [searchQuery__interest, setSearchQuery__interest] = useState<
    string | null
  >(null);
  setSearchQuery__interest; // TODO: use this in some UI

  const filteredUsers = users
    // this is O(count(users) * count(avg(count(interests))) * count(avg(len(interests.name)))). very bad.
    ?.filter(
      (u) =>
        searchQuery__interest === null ||
        u.interestSubjects.some((i) => i.name.includes(searchQuery__interest)),
    );

  return (
    <div className="flex min-h-screen justify-center ">
      <div className="w-full">
        <h2 className="m-5 mb-4 font-bold text-2xl">ユーザー検索</h2>
        <Search placeholder="検索" setSearchString={setQuery} />
        {filteredUsers ? (
          <Table users={filteredUsers} canRequest={canRequest} />
        ) : (
          <FullScreenCircularProgress />
        )}
      </div>
    </div>
  );
}
