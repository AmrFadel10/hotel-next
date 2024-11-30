import prisma from "@/utils/db";

export default async function getBookings(hotelId: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        hotelId,
        endDate: { gt: yesterday },
      },
    });
    return bookings;
  } catch (error) {
    throw error;
  }
}
