import React from "react";
import HotelCard from "./HotelCard";
import { Hotel, Room } from "@prisma/client";
type hotel = Hotel & { rooms: Room[] };
export default function HotelList({ hotels }: { hotels: hotel[] }) {
  return (
    <section className="grid gird-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-6 gap-4 lg:mt-10 mt-6 flex-1 content-start">
      {hotels?.map((hotel, index) => {
        return <HotelCard key={index} hotel={hotel} />;
      })}
    </section>
  );
}
