import React from "react";
import LoginForm from "./LoginForm";
import { verifyToken } from "@/utils/verifyToken";
import { redirect } from "next/navigation";

export default function Login() {
  const checkUser = verifyToken();
  if (checkUser) return redirect("/");

  return (
    <section className="flex justify-center items-center flex-1 flex-col font-semibold">
      <h1 className="mb-10 text-4xl ">Login user</h1>
      <LoginForm />
    </section>
  );
}
