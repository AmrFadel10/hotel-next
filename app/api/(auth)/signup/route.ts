import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { createUservalid } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/utils/setCookie";

/**
 * @route   ~/api/signup/
 * @desc    create a user
 * @method  post
 * @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validate = createUservalid.safeParse(body);
    if (!validate.success) {
      return NextResponse.json(
        { message: validate.error.errors[0].message },
        { status: 400 }
      );
    }

    //check email user exists
    const user = await prisma.user.findFirst({ where: { email: body.email } });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    //create user
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
    });
    setCookie({ username: newUser.username, userId: newUser.id });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
