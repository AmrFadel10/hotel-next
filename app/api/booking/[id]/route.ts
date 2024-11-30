import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 * @access private
 * @method PUT
 * @desc   update a booking
 * @route  ~/api/booking/:id
 */

export async function PUT(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json({ message: "Login first" }, { status: 401 });
    }
    const booking = await prisma.booking.findUnique({
      where: { paymentIntentId: id },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 400 }
      );
    }

    await prisma.booking.update({
      where: { paymentIntentId: id },
      data: { paymentStatus: true },
    });

    return NextResponse.json(
      { message: "Booking has been reserved successfully" },
      { status: 200 }
    );
  } catch (error) {
    const messageError =
      error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json({ message: messageError }, { status: 500 });
  }
}

/**
 * @route   ~/api/booking/:id
 * @desc    delete booking
 * @method  DELETE
 * @access  private
 */

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    let booking = await prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 400 }
      );
    }

    booking = await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
