import { cookies } from "next/headers";
import { generateToken } from "./generateToken";

export const setCookie = (payload: JWTPayloadTypes) => {
  const token = generateToken(payload);
  cookies().set("token", token, {
    maxAge: 30 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
