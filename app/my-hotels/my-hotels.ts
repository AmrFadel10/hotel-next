import prisma from "@/utils/db";

export const myHotelsById = async (id: string) => {
  const hotels = await prisma.hotel.findMany({
    where: { userId: id },
    include: { rooms: true },
  });
  return hotels;
};
