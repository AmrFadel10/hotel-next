import React from "react";

export default function Loading() {
  return (
    <div className="text-3xl min-h-screen w-full flex justify-center items-center">
      <span className="bg-transparent border-2  rounded-full border-r-transparent animate-spin block md:w-20 w-14  md:h-20 h-14  border-slate-950"></span>
    </div>
  );
}
