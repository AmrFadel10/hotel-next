import prisma from "@/utils/db";

export const getHotels = async (
  title?: string,
  country?: string,
  city?: string,
  state?: string
) => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        title: { contains: title, mode: "insensitive" },
        country,
        state,
        city,
      },
      include: { rooms: true },
    });
    return hotels;
  } catch (error) {
    throw error;
  }
};
