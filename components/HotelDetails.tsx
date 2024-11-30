"use client";
import useLocations from "@/utils/useLocation";
import { Booking, Hotel, Room } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { BiCoffee, BiMoviePlay } from "react-icons/bi";
import { BsTree } from "react-icons/bs";
import { CgGym } from "react-icons/cg";
import { FiMapPin } from "react-icons/fi";
import { IoRestaurantOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { MdOutlineLocalLaundryService, MdPool } from "react-icons/md";
import { TbBike, TbMassage } from "react-icons/tb";
import RoomCard from "./RoomCard";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

type hotel = Hotel & { rooms: Room[] };
export default function HotelDetails({
  hotel,
  bookings,
}: {
  hotel: hotel;
  bookings: Booking[];
}) {
  const { getCountryByCode } = useLocations();
  const country = getCountryByCode(hotel.country)?.name;

  return (
    <>
      <div className="relative w-full h-80 rounded-xl overflow-hidden bg-zinc-50">
        <Image alt="image" src={hotel?.imageUrl as string} priority fill />
      </div>
      <h1 className="text-2xl font-bold capitalize mt-2 mb-1 ">
        {hotel.title}
      </h1>
      <div className="flex gap-x-2 items-center text-base font-semibold">
        <FiMapPin size={17} />
        {country},{hotel?.city}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold ">Location details:</h3>
        <p className="text-gray-500  ">{hotel.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold ">About this hotel:</h3>
        <p className="text-gray-500  ">{hotel.locationDescription}</p>
      </div>
      <h3 className="text-lg font-semibold ">Popular amenities:</h3>

      <div className="flex justify-between gap-3 border-b pb-4">
        <div className="flex-1 flex flex-col gap-y-3">
          {hotel.gym && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <CgGym size={17} />
              {hotel.gym} gym
            </div>
          )}
          {hotel.spa && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <TbMassage size={17} />
              {hotel.spa} spa
            </div>
          )}
          {hotel.laundry && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <MdOutlineLocalLaundryService size={17} />
              {hotel.laundry} laundry
            </div>
          )}
          {hotel.restaurant && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <IoRestaurantOutline size={17} />
              {hotel.restaurant} restaurant
            </div>
          )}
          {hotel.swimmingPool && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <MdPool size={20} />
              {hotel.swimmingPool} swimmingPool
            </div>
          )}
          {hotel.coffeeShop && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <BiCoffee size={17} />
              {hotel.coffeeShop} coffeeShop
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-y-3">
          {hotel.shopping && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <LuShoppingCart size={17} />
              {hotel.shopping} shopping
            </div>
          )}
          {hotel.freeParking && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <BsTree size={19} />
              {hotel.freeParking} freeParking
            </div>
          )}
          {hotel.bikeRental && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <TbBike size={17} />
              {hotel.bikeRental} bikeRental
            </div>
          )}
          {hotel.movieNights && (
            <div className="flex gap-x-2 items-center text-base  capitalize">
              <BiMoviePlay size={17} />
              {hotel.movieNights} movieNights
            </div>
          )}
        </div>
      </div>
      {hotel && (
        <>
          <h3 className="text-xl font-bold mb-6 border-b py-3 w-fit">
            Hotel rooms:-
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mx-auto">
            {hotel?.rooms?.map((room, index) => {
              return (
                <RoomCard
                  key={index}
                  room={room}
                  hotelId={hotel.id}
                  hotelOwnerId={hotel.userId}
                  bookings={bookings}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
