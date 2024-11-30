"use client";
import { CreateQueryString } from "@/utils/QueryString";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function Search() {
  const router = useRouter();
  const pathName = usePathname();
  const [search, setSearch] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setTimeout(() => setSearch(e.target.value), 300);
  };

  useEffect(() => {
    if (search) {
      router.push(
        `${pathName}?${CreateQueryString(searchParams, "search", search)}`
      );
    }
  }, [search]);

  return (
    <div className="relative">
      <LuSearch
        className="absolute left-[10px] top-1/2 -translate-y-1/2"
        size={18}
      />
      <input
        type="text"
        name="search"
        placeholder="Search"
        className="border-none shadow-md md:py-3 py-2 md:pr-4 pr-2 pl-8 md:pl-10 focus:outline-none rounded-full md:w-96 ring-2  ring-gray-200 text-sm font-semibold"
        onChange={handleChange}
      />
    </div>
  );
}
