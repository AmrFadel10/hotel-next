import prisma from "@/utils/db";

export const getHotels = async (page:number,
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
      take:9,
      skip:(page-1) * 9
    });
    const count = await prisma.hotel.count({
      where: {
        title: { contains: title, mode: "insensitive" },
        country,
        state,
        city,
      }
    });
    return {hotels,count};
  } catch (error) {
    throw error;
  }
};
