"use client";

import type React from "react";
import { useState } from "react";
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

  return (
    <div className="flex min-h-screen justify-center ">
      <div className="w-full">
        <h2 className="m-5 mb-4 font-bold text-2xl">ユーザー検索</h2>
        <Search placeholder="検索" setSearchString={setQuery} />
        <Table query={query} />
      </div>
    </div>
  );
}
