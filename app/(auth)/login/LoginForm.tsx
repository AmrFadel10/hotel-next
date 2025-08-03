"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { CiLock } from "react-icons/ci";
import { MdAlternateEmail, MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import Link from "next/link";
import { DOMAIN } from "@/utils/CONSTANTS";
import { useRouter } from "next/navigation";
import { loginUservalid } from "@/utils/validation";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";

export default function LoginForm() {
  const [data, setData] = useState({ email: "", password: "" });
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [messagesError, setMessagesError] = useState<{
    [prop: string]: string;
  }>({});
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const validate = loginUservalid.safeParse(data);
    const messagesError: { [prop: string]: string } = {};
    if (!validate.success) {
      for (let i = 0; i < validate.error.errors.length; i++) {
        messagesError[validate.error.errors[i].path[0]] =
          validate.error.errors[i].message;
      }
    }
    setMessagesError(messagesError);
    try {
      const response = await fetch(`${DOMAIN}/api/login`, {
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
      router.replace("/");
      return router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="md:w-[400px] w-full flex gap-y-6 flex-col border rounded-xl px-10 py-12 "
      onSubmit={handleSubmit}
    >
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
            className="text-sm py-4 pl-10  focus:outline-none border rounded-xl w-full text-gray-700"
            onChange={handleChange}
          />
        </div>
        {!!messagesError.email && (
          <p className="text-red-500 text-[12px] pl-8">{messagesError.email}</p>
        )}
      </div>{" "}
      <div className="flex-col flex ">
        <div className="relative">
          <CiLock
            className="top-1/2 absolute left-2 -translate-y-1/2 "
            size={22}
          />
          <input
            type={togglePassword ? "text" : "password"}
            placeholder="Write you password..."
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
      </div>
      {!!messagesError.password && (
        <p className="text-red-500 text-[12px] pl-8">
          {messagesError.password}
        </p>
      )}
      <button
        disabled={loading}
        className={`flex items-center gap-2 w-fit mx-auto py-2 font-semibold text-sm px-8 text-gray-50 text-center bg-slate-800 hover:bg-slate-950 rounded-lg  ${
          loading && "cursor-not-allowed"
        }`}
      >
        {loading ? (
          <>
            <Spinner size={16} /> <span>Loading...</span>
          </>
        ) : (
          "Login"
        )}
      </button>
      <div className="text-sm text-gray-400 ">
        {"Don't have account ? "}
        <Link
          href={"/signup"}
          className="hover:underline underline-offset-2 text-slate-800 hover:text-slate-950"
        >
          Signup
        </Link>
      </div>
    </form>
  );
}
