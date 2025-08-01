"use client";
import { FiUser } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { DOMAIN } from "@/utils/CONSTANTS";
import { usePathname, useRouter } from "next/navigation";
import Search from "./Search";
import FilterBar from "./FilterBar";

export default function Header({ user }: { user?: User }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch(`${DOMAIN}/api/signout`);
      let data;
      if (!response.ok) {
        data = await response.json();
        toast.error(data.message);
      }
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    }
  };
  const pathName = usePathname();
  return (
    <>
      <header className="container px-2 sm:px-0 flex justify-between mx-auto my-6 items-center">
        <Link
          href={"/"}
          className="rounded-full overflow-hidden hover:opacity-80 md:w-12 w-9 md:h-12 h-9 relative"
        >
          <Image src={"/logo.png"} fill alt="logo" priority />
        </Link>
        {pathName === "/" && <Search />}
        <div>
          {user ? (
            <div className="font-bold text-sm capitalize flex gap-2 items-center">
              <span>{user.username}</span>
              <div
                className="rounded-full cursor-pointer group relative"
                onClick={() => setOpen(!open)}
              >
                <Image
                  src={
                    // user.imageUrl  ||
                    "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"
                  }
                  width={35}
                  height={35}
                  alt="image"
                  className="rounded-full group-hover:opacity-70 aspect-square opacity-80"
                />
                <ul
                  className={`${
                    open ? "block" : "hidden"
                  } absolute top-[110%] right-2 divide-y w-40 z-40 rounded-md shadow shadow-gray-500 bg-white`}
                >
                  <Link
                    href={"/hotel/create"}
                    className="px-4 py-3  hover:bg-gray-50 text-sm transition-all duration-200 block"
                  >
                    Add hotel
                  </Link>
                  <Link
                    href={"/my-hotels"}
                    className="px-4 py-3 hover:bg-gray-50 text-sm transition-all duration-200 block"
                  >
                    My hotels
                  </Link>
                  <Link
                    href={"/my-bookings"}
                    className="px-4 py-3 hover:bg-gray-50 text-sm transition-all duration-200 block"
                  >
                    My bookings
                  </Link>
                  <li
                    className="px-4 py-3 hover:bg-gray-50 text-sm transition-all duration-200 block"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="no-underline py-[6px] px-3 bg-slate-900 text-base text-slate-50 rounded-lg font-semibold  hover:bg-slate-950 transition-colors flex gap-1 items-center"
            >
              <FiUser size={18} />
              Login
            </Link>
          )}
        </div>
      </header>
      {pathName === "/" && <FilterBar />}
    </>
  );
}
