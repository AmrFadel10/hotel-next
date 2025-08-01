import prisma from "@/utils/db";

export default async function getBookingsByUserId(userId: string) {
  try {
    const bookingsByUserId = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        Room: true,
        Hotel: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });
    return bookingsByUserId;
  } catch (error) {
    throw error;
  }
}
