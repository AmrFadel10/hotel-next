"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { FiUser } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import Link from "next/link";
import { createUservalid } from "@/utils/validation";
import { DOMAIN } from "@/utils/CONSTANTS";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupForm() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "", username: "" });
  const [togglePassword, setTogglePassword] = useState(false);
  const [messagesError, setMessagesError] = useState<{
    [prop: string]: string;
  }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validate = createUservalid.safeParse(data);
    const messagesError: { [prop: string]: string } = {};
    if (!validate.success) {
      for (let i = 0; i < validate.error.errors.length; i++) {
        messagesError[validate.error.errors[i].path[0]] =
          validate.error.errors[i].message;
      }
    }
    setMessagesError(messagesError);
    console.log(data);
    try {
      const response = await fetch(`${DOMAIN}/api/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });
      const details = await response.json();
      if (!response.ok) {
        throw new Error(details.message);
      }
      return router.replace("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    }
  };
  return (
    <form
      className="md:w-[400px] w-full flex gap-y-6 flex-col border rounded-xl px-10 py-12 "
      onSubmit={handleSubmit}
    >
      <div className="flex-col flex ">
        <div className="relative">
          <FiUser
            className="top-1/2 absolute left-2 -translate-y-1/2 "
            size={20}
          />
          <input
            type="text"
            name="username"
            placeholder="Write you username..."
            value={data.username}
            className="text-sm py-4 pl-10  focus:outline-none border rounded-xl w-full text-gray-700"
            onChange={handleChange}
          />
        </div>
        {!!messagesError.username && (
          <p className="text-red-500 text-[12px] pl-8">
            {messagesError.username}
          </p>
        )}
      </div>
      <div className="flex-col flex ">
        <div className="relative">
          <MdAlternateEmail
            className="top-1/2 absolute left-2 -translate-y-1/2 "
            size={20}
          />
          <input
            type="text"
            name="email"
            placeholder="Write you email..."
            value={data.email}
            className="text-sm py-4 pl-10  focus:outline-none border rounded-xl w-full text-gray-700"
            onChange={handleChange}
          />
        </div>
        {!!messagesError.email && (
          <p className="text-red-500 text-[12px] pl-8">{messagesError.email}</p>
        )}
      </div>
      <div className="flex-col flex ">
        <div className="relative">
          <CiLock
            className="top-1/2 absolute left-2 -translate-y-1/2 "
            size={23}
          />
          <input
            type={togglePassword ? "text" : "password"}
            placeholder="Write you password..."
            value={data.password}
            name="password"
            className="text-sm py-4 px-10 focus:outline-none border rounded-xl w-full text-gray-700"
            onChange={handleChange}
          />
          {togglePassword ? (
            <MdOutlineVisibility
              onClick={() => setTogglePassword(false)}
              size={23}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            />
          ) : (
            <MdOutlineVisibilityOff
              onClick={() => setTogglePassword(true)}
              size={22}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            />
          )}
        </div>
        {!!messagesError.password && (
          <p className="text-red-500 text-[12px] pl-8">
            {messagesError.password}
          </p>
        )}
      </div>
      <button className="w-fit mx-auto py-2 font-semibold text-sm px-8 text-gray-50 text-center bg-indigo-500 hover:bg-indigo-600 rounded-lg">
        Signup
      </button>
      <div className="text-sm text-gray-400 ">
        {"Already have account ? "}
        <Link
          href={"/login"}
          className="hover:underline underline-offset-2 text-indigo-500 hover:text-indigo-700"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
