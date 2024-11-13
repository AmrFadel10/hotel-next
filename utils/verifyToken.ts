import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const verifyToken = (): JWTPayloadType | null => {
  try {
    const cookie = cookies().get("token");
    if (!cookie) return null;
    return jwt.verify(
      cookie.value,
      process.env.JWT_SECRETE as string
    ) as JWTPayloadType;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
