import prisma from "@/utils/db";
import { Room } from "@prisma/client";

export const getRoomsByHotel = async (hotelId: string) => {
  const response = (await prisma.room.findMany({
    where: { hotelId },
  })) as Room[];
  if (response.length === 0) return null;
  return response;
};
