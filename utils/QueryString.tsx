"use client";

import { ReadonlyURLSearchParams } from "next/navigation";

export const CreateQueryString = (
  searchParams: ReadonlyURLSearchParams,
  name: string,
  value: string
) => {
  const param = new URLSearchParams(searchParams.toString());
  param.set(name, value);
  return param.toString();
};
