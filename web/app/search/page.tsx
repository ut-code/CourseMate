"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRecommended } from "~/api/user";

import { useModal } from "~/components/common/modal/ModalProvider";
import { HumanListItem } from "~/components/human/humanListItem";

const SearchPage: React.FC = () => {
  const [searchWord, setSearchWord] = useState("");
  const { data: recommended } = useRecommended();
  const { openModal } = useModal();
  const [users, setUsers] = useState<
    | {
        id: number;
        guid: string;
        name: string;
        gender: string;
        grade: string;
        faculty: string;
        department: string;
        intro: string;
        pictureUrl: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (recommended) {
      setUsers(recommended);
    }
  }, [recommended]);

  function searchByUserName() {
    const filteredUsers = recommended?.filter((user) =>
      user.name.toLowerCase().includes(searchWord.toLowerCase()),
    );
    setUsers(filteredUsers || null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="card w-96 bg-white p-6 shadow-md">
        <h2 className="mb-4 font-bold text-2xl">Search</h2>

        <div className="form-control mb-4">
          <label htmlFor="searchInput" className="label">
            <span className="label-text">Enter search term</span>
          </label>
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="button"
          onClick={searchByUserName}
          className="btn btn-primary w-full"
        >
          Search
        </button>
        {users?.map((user) => (
          <HumanListItem
            key={user.id}
            id={user.id}
            name={user.name}
            pictureUrl={user.pictureUrl}
            onOpen={() => openModal(user)}
            hasDots
          ></HumanListItem>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
