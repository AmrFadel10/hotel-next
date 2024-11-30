"use client";
import React from "react";

export default function error({ reset, error }: ErrorPageTypes) {
  return (
    <div className="text-lg w-full flex flex-col gap-6 justify-center items-center min-h-screen">
      <div className="w-full break-all">Error messageis :{error.message}</div>
      <button
        onClick={() => reset()}
        className="border py-2 px-4 hover:bg-gray-950 bg-zinc-900 text-zinc-50 rounded-full"
      >
        Reload page.
      </button>
    </div>
  );
}
