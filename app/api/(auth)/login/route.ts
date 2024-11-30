import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { loginUservalid } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/utils/setCookie";

/**
 * @route   ~/api/login/
 * @desc    login user
 * @method  post
 * @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //validation
    const validate = loginUservalid.safeParse(body);
    if (!validate.success) {
      return NextResponse.json(
        { message: validate.error.errors[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findFirst({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json(
        { message: "email or password is wrong" },
        { status: 400 }
      );
    }
    const isPasswordMatched = await bcrypt.compare(
      body.password,
      user.password
    );
    if (!isPasswordMatched) {
      return NextResponse.json(
        { message: "email or password is wrong" },
        { status: 400 }
      );
    }

    setCookie({ username: user.username, userId: user.id, email: user.email });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
