"use client";
import { Hotel, Room } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { FiMapPin } from "react-icons/fi";
import useLocations from "@/utils/useLocation";
import { CgGym } from "react-icons/cg";
import { IoRestaurantOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { BiCoffee } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type hotel = Hotel & { rooms: Room[] };

interface propsType {
  hotel: hotel;
}
export default function HotelCard({ hotel }: propsType) {
  const { getCountryByCode } = useLocations();
  const country = getCountryByCode(hotel.country)?.name;
  const isMyHotels = usePathname().includes("my-hotels");
  const router = useRouter();
  return (
    <article
      className={`flex gap-1 border rounded-xl  transition-all duration-200 overflow-hidden shadow ${
        !isMyHotels &&
        "shadow-gray-300 hover:shadow-gray-500 hover:scale-[1.02] hover:translate-y-1"
      } ${!isMyHotels && "cursor-pointer"}`}
      onClick={() =>
        !isMyHotels && router.push("/hotel/hotel-details/" + hotel.id)
      }
    >
      <div className="relative flex-1 h-auto ">
        <Image
          alt={"image"}
          src={hotel.imageUrl}
          fill
          className="w-full h-full"
        ></Image>
      </div>
      <div className="flex-1 flex gap-y-2 p-2 flex-col ">
        <h2 className="text-xl font-semibold line-clamp-1 break-all ">
          {hotel.title}
        </h2>
        <p className="text-gray-500 line-clamp-2 break-all md:text-sm text-xs my-1">
          {hotel.description}
        </p>
        <div className="flex justify-between gap-3">
          <div className="flex-1 flex flex-col gap-y-1">
            <div className="flex gap-x-1 items-center text-xs font-semibold">
              <FiMapPin size={15} />
              {country},{hotel.city}
            </div>
            {hotel.gym && (
              <div className="flex gap-x-1 items-center text-xs font-semibold capitalize">
                <CgGym size={15} />
                {hotel.gym} gym
              </div>
            )}

            {hotel.restaurant && (
              <div className="flex gap-x-1 items-center text-xs font-semibold capitalize">
                <IoRestaurantOutline size={15} />
                {hotel.restaurant} restaurant
              </div>
            )}
            {hotel.shopping && (
              <div className="flex gap-x-1 items-center text-xs font-semibold capitalize">
                <LuShoppingCart size={15} />
                {hotel.shopping} shopping
              </div>
            )}

            {hotel.coffeeShop && (
              <div className="flex gap-x-1 items-center text-xs font-semibold capitalize">
                <BiCoffee size={15} />
                {hotel.coffeeShop} coffeeShop
              </div>
            )}
          </div>
        </div>
        {isMyHotels && (
          <button
            className="py-1 px-4 bg-gray-800 hover:bg-gray-950 rounded-md text-gray-50 w-fit ml-auto md:text-base text-sm"
            onClick={() => router.push(`/hotel/${hotel.id}`)}
          >
            Edit
          </button>
        )}
      </div>
    </article>
  );
}
