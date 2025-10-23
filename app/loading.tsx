import React from "react";

export default function Loading() {
  return (
    <div className="text-3xl min-h-screen w-full flex justify-center items-center fixed left-0 top-0 bg-white">
      <span className="bg-transparent border-8  rounded-full border-r-transparent animate-spin block  w-14   h-14  border-slate-950"></span>
    </div>
  );
}
