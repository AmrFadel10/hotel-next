import { Hotel, Room } from "@prisma/client";
import prisma from "@/utils/db";
import { notFound } from "next/navigation";
import HotelDetails from "@/components/HotelDetails";
import getBookings from "./getBookings";

type hotel = Hotel & { rooms: Room[] };
export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const hotel = (await prisma.hotel.findUnique({
    where: { id },
    include: { rooms: true },
  })) as hotel;
  if (!hotel) return notFound();

  return (
    <section className="w-full flex gap-4 flex-col">
      <HotelDetails hotel={hotel} bookings={await getBookings(id)} />
    </section>
  );
}
