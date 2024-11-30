import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { redirect } from "next/navigation";

async function getHotel({ hotelId }: { hotelId: string }) {
  const user = verifyToken();
  if (!user) return redirect("/");
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { rooms: true },
    });

    if (!hotel) return null;

    return hotel;
  } catch (error) {
    throw error;
  }
}

export default getHotel;
