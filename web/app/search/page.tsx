"use client";

import type React from "react";
import Search from "~/components/search/search";
import Table from "~/components/search/table";

export default function SearchPage(props: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const searchParams = props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="card w-96 bg-white p-6 shadow-md">
        <h2 className="mb-4 font-bold text-2xl">Search</h2>
        <Search placeholder="検索" />
        <Table query={query} />
      </div>
    </div>
  );
}
