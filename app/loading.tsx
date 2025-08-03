import { Spinner } from "@/components/Spinner";
import React from "react";

export default function Loading() {
  return (
    <div className=" min-h-screen w-screen flex items-center justify-center fixed left-0 top-0">
      <Spinner size={45} color="#0f172a" />
    </div>
  );
}
