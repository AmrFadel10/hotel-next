"use client";
import { CreateQueryString } from "@/utils/QueryString";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ count }: { count: number }) => {
  const searchParams = useSearchParams();
  const pageInSearchParams = parseInt(searchParams.get("page") || "1");
  const router = useRouter();
  const handlePage = (page: number) => {
    const searchParamsString = CreateQueryString(
      searchParams,
      "page",
      page.toString()
    );
    router.push(`/?${searchParamsString}`);
  };
  const numberOfPages = Math.ceil(count / 9);
  console.log(pageInSearchParams);
  return (
    <section className="flex gap-1 w-fit mx-auto mt-8">
      <button
        className={`${
          pageInSearchParams == 1
            ? "cursor-no-drop opacity-65"
            : "hover:bg-slate-950 hover:text-gray-50 cursor-pointer"
        } border border-gray-400 rounded-md py-[2px] px-2  bg-white transition`}
        onClick={() => {
          if (pageInSearchParams && !isNaN(pageInSearchParams)) {
            if (pageInSearchParams <= 1) {
              return;
            }
            router.push(
              `/?${CreateQueryString(
                searchParams,
                "page",
                `${pageInSearchParams - 1}`
              )}`
            );
          }
        }}
      >
        Prev
      </button>
      {new Array(numberOfPages).fill(0).map((ele, index) => {
        return (
          <button
            key={index + 1}
            onClick={() => handlePage(index + 1)}
            className={`${
              pageInSearchParams == index + 1
                ? "bg-slate-800 text-gray-50"
                : "hover:bg-slate-950 hover:text-gray-50 bg-white"
            } border border-gray-400 rounded-md py-[2px] px-2   transition hover:cursor-pointer`}
          >
            {index + 1}
          </button>
        );
      })}
      <button
        className={`${
          pageInSearchParams >= numberOfPages
            ? "cursor-no-drop opacity-65"
            : "hover:bg-slate-950 hover:text-gray-50 cursor-pointer"
        } border border-gray-400 rounded-md py-[2px] px-2  bg-white transition`}
        onClick={() => {
          if (pageInSearchParams && !isNaN(pageInSearchParams)) {
            if (pageInSearchParams >= numberOfPages) {
              return;
            }
            CreateQueryString(
              searchParams,
              "page",
              `${pageInSearchParams + 1}`
            );
            router.push(
              `/?${CreateQueryString(
                searchParams,
                "page",
                `${pageInSearchParams + 1}`
              )}`
            );
          }
        }}
      >
        Next
      </button>
    </section>
  );
};

export default Pagination;
