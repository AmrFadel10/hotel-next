"use client";

export const CreateQueryString = (
  searchParams: any,
  name: string,
  value: string
) => {
  const param = new URLSearchParams(searchParams.toString());
  param.set(name, value);
  return param.toString();
};
