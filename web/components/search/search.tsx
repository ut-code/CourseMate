"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { MdOutlineSearch } from "react-icons/md";

type Props = { placeholder: string; setSearchString: (s: string) => void };
export default function Search({ placeholder, setSearchString }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleSearch(term: string) {
    setSearchString(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    const newUrl = `${pathname}?${params.toString()}`;
    history.replaceState(undefined, "", newUrl);
  }

  return (
    <label className="input input-bordered flex items-center gap-2">
      <MdOutlineSearch className="text-gray-500" />
      <input
        type="text"
        className="grow"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </label>
  );
}
