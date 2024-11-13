import React from "react";
import SignupForm from "./SignupForm";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/verifyToken";

export default function Signup() {
  const checkUser = verifyToken();
  if (checkUser) return redirect("/");
  return (
    <section className="flex justify-center items-center flex-1 flex-col font-semibold">
      <h1 className="mb-10 text-4xl ">Register a new user</h1>
      <SignupForm />
    </section>
  );
}
