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
    <div className="relative mr-5 ml-5 flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className=" block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-none placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MdOutlineSearch className="-translate-y-1/2 absolute top-1/2 left-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
