import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @route   ~/api/logout/
 * @desc    logout user
 * @method  GET
 * @access  public
 */

export async function GET(request: NextRequest) {
  try {
    cookies().delete("token");
    return NextResponse.json({ message: "logout" }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
