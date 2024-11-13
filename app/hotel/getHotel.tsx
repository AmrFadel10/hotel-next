import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { notFound, redirect } from "next/navigation";

async function getHotel({ hotelId }: { hotelId: string }) {
  const user = verifyToken();
  if (!user) return redirect("/");
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { rooms: true },
  });
  if (!hotel) {
    return notFound();
  }
  return hotel;
}

export default getHotel;
