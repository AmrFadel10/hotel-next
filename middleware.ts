// import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const cookie = cookies().get("token");
    if (!cookie) {
      return NextResponse.json(
        { message: "You have to login first" },
        { status: 401 }
      );
    }
    const verify = jwt.verify(cookie.value, process.env.JWT_SECRETE as string);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export const config = {
  matcher: ["/api/login"],
};
