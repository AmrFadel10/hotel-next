import React from "react";
import HotelCard from "./HotelCard";
import { Hotel, Room } from "@prisma/client";
type hotel = Hotel & { rooms: Room[] };
export default function HotelList({ hotels }: { hotels: hotel[] }) {
  return (
    <div className="grid gird-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:mt-20 mt-6 flex-1">
      {hotels?.map((hotel, index) => {
        return <HotelCard key={index} hotel={hotel} />;
      })}
    </div>
  );
}
