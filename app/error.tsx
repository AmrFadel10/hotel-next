"use client";
import React from "react";

export default function error({ reset, error }: ErrorPageTypes) {
  return (
    <div className="text-lg">
      <div>Error messageis :{error.message}</div>
      <button onClick={() => reset()}>reload</button>
    </div>
  );
}
