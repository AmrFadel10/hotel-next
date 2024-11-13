import { LuSearch } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { verifyToken } from "@/utils/verifyToken";
import prisma from "@/utils/db";

export default async function Header() {
  const checkUser = verifyToken();
  // let user;
  // if (checkUser) {
  //   user = await prisma.user.findUnique({ where: { id: checkUser.userId } });
  //   console.log(user);
  // }
  return (
    <header className="container px-2 sm:px-0 flex justify-between mx-auto my-6 items-center">
      <Link
        href={"/"}
        className="rounded-full overflow-hidden hover:opacity-95"
      >
        <Image src={"/logo.webp"} width={35} height={35} alt="logo" priority />
      </Link>
      <div className="relative">
        <LuSearch
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={20}
        />
        <input
          type="text"
          name="search"
          placeholder="Search"
          className="border-none shadow-md py-3 pr-4 pl-12 focus:outline-none rounded-full md:w-96 ring-2  ring-gray-200 text-sm font-semibold"
        />
      </div>
      <div>
        {checkUser ? (
          <div className="font-bold text-sm capitalize">
            {checkUser.username}
          </div>
        ) : (
          <Link
            href={"/login"}
            className="no-underline py-2 px-5 bg-indigo-600 text-base text-slate-50 rounded-lg font-semibold  hover:bg-indigo-700 transition-colors flex gap-1 items-center"
          >
            <FiUser size={18} />
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
