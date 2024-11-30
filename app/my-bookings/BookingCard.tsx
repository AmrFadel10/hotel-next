"use client";
import { DOMAIN } from "@/utils/CONSTANTS";
import useLocations from "@/utils/useLocation";
import { Booking, Hotel, Room } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiBath } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { GiFoodTruck } from "react-icons/gi";
import { GoMute } from "react-icons/go";
import { LuBed, LuMapPin } from "react-icons/lu";
import { MdBalcony, MdOutlineSignalWifi0Bar } from "react-icons/md";
import { PiMountainsLight } from "react-icons/pi";
import { RiHome4Line } from "react-icons/ri";
import { TbAirConditioning } from "react-icons/tb";

interface timeType {
  diffDays: number | null;
  diffMins: number | null;
  diffHrs: number | null;
}
export default function BookingCard({
  booking,
}: {
  booking: Booking & { Room: Room; Hotel: Hotel };
}) {
  const [loadingBook, setLoadingBook] = useState(false);
  const [time, setTime] = useState<timeType>({
    diffDays: null,
    diffMins: null,
    diffHrs: null,
  });

  const router = useRouter();

  //country && state:-
  const { getCountryByCode, getStateByCode } = useLocations();
  const country = getCountryByCode(booking.Hotel.country)?.name;
  let state;
  if (booking.Hotel.state) {
    state = getStateByCode(booking.Hotel.country, booking.Hotel.state)?.name;
  }

  const handleBookingRoom = async () => {
    try {
      setLoadingBook(true);
      const response = await fetch(`${DOMAIN}/api/create-payment-intent`, {
        method: "POST",
        body: JSON.stringify({
          bookingData: {
            roomId: booking.Room.id,
            hotelId: booking.hotelId,
            hotelOwnerId: `${booking.hotelOwnerId}`,
            breakfastIncluded: booking.breakfastIncluded,
            totalPrice: booking.totalPrice,
            startDate: booking.startDate,
            endDate: booking.endDate,
          },
          payment_intent_id: !!localStorage.getItem("payment")
            ? JSON.parse(localStorage.getItem("payment")!)?.payment
                .paymentIntentId
            : undefined,
        }),
        headers: { "content-type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return router.replace("/login");
        }
        throw await response.json();
      }
      const dataPayment = await response.json();

      //save in local storage
      localStorage.setItem(
        "payment",
        JSON.stringify({
          bookingData: {
            roomId: booking.roomId,
            hotelId: booking.hotelId,
            hotelOwnerId: `${booking.hotelOwnerId}`,
            breakfastIncluded: booking.breakfastIncluded,
            totalPrice: booking.totalPrice,
            startDate: booking.startDate,
            endDate: booking.endDate,
          },
          payment: {
            clientSecret: dataPayment.client_secret,
            paymentIntentId: dataPayment.id,
          },
          room: booking.Room,
        })
      );
      return router.replace("/book-room");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
      throw error;
    } finally {
      setLoadingBook(false);
    }
  };
  useEffect(() => {
    const diffTime =
      new Date().getTime() - new Date(booking.bookedAt).getTime();
    const diffDays = diffTime / (24 * 1000 * 60 * 60);
    const diffHrs = (diffTime % (24 * 1000 * 60 * 60)) / (1000 * 60 * 60);
    const diffMins = (diffTime % (1000 * 60 * 60)) / (1000 * 60);
    setTime({ diffDays, diffMins, diffHrs });
  }, []);

  return (
    <article className="md:p-6 p-3 rounded-lg flex flex-col gap-4  border shadow-md text-gray-700">
      <h2 className="text-2xl font-extrabold break-words line-clamp-1  capitalize">
        {booking.Hotel.title}
      </h2>
      <div className="flex gap-1 text-gray-600 font-semibold items-center">
        <LuMapPin size={18} />
        {country && country} {state && <span>, state</span>}
        {booking.Hotel.city && <span>, booking.Hotel.city</span>}
      </div>
      <p className="text-sm text-gray-600 border-b line-clamp-1 leading-10 pb-3 w-full">
        {booking.Hotel.locationDescription}
      </p>
      <h3 className="text-xl font-bold break-words line-clamp-1">
        {booking.Room.title}
      </h3>
      <p className="text-gray-500 text-sm break-words line-clamp-2">
        {booking.Room.description}
      </p>
      <div className="md:h-52 h-36 relative overflow-hidden rounded-xl">
        <Image
          alt={"roomcard"}
          height={150}
          width={150}
          src={booking.Room.imageUrl}
          className=" w-full h-full"
        />
      </div>
      <div className="flex gap-4 flex-row md:flex-col p-2">
        <div className="flex-1 flex gap-3 flex-col">
          {!!booking.Room.bedCount && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <LuBed size={20} />
              {booking.Room.bedCount} bed(s)
            </div>
          )}
          {!!booking.Room.bathroomCount && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <BiBath size={20} />
              {booking.Room.bathroomCount} bathroom(s)
            </div>
          )}
          {!!booking.Room.queenBed && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <LuBed size={20} />
              {booking.Room.queenBed} Queen bed(s)
            </div>
          )}
          {!!booking.Room.balcony && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <MdBalcony size={20} />
              {booking.Room.balcony} Balcony
            </div>
          )}
          {!!booking.Room.airCondition && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <TbAirConditioning size={20} />
              {booking.Room.airCondition} Aircondition
            </div>
          )}
          {!!booking.Room.mountainView && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <PiMountainsLight size={20} />
              {booking.Room.mountainView} Mountainview
            </div>
          )}
        </div>
        <div className="flex-1 flex gap-3 flex-col">
          {!!booking.Room.kingBed && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <LuBed size={20} />
              {booking.Room.kingBed} King bed(s)
            </div>
          )}
          {!!booking.Room.freeWifi && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <MdOutlineSignalWifi0Bar size={20} />
              {booking.Room.freeWifi} King bed(s)
            </div>
          )}
          {!!booking.Room.guestCount && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <FiUsers size={18} />
              {booking.Room.guestCount} Guest(s)
            </div>
          )}
          {!!booking.Room.roomservice && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <GiFoodTruck size={20} />
              {booking.Room.roomservice} Room service
            </div>
          )}
          {!!booking.Room.cityView && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <RiHome4Line size={20} />
              {booking.Room.cityView} Room service
            </div>
          )}
          {!!booking.Room.soundProofed && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <GoMute size={20} />
              {booking.Room.soundProofed} Room service
            </div>
          )}
        </div>
      </div>
      <div className="py-2 border-y  flex justify-between">
        <div className=" text-sm text-left">
          Room price:
          <span className="font-bold">${booking.Room.roomPrice}/24h</span>
        </div>
        <div className=" text-sm text-left">
          Breakfast price:{" "}
          <span className="font-bold">${booking.Room.breakFastPrice}</span>
          /24h
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <h3 className="text-xl font-bold mb-2">Booking details:-</h3>
        <p className="">
          Room booked by {booking.userName} for{" "}
          {Math.floor(time?.diffDays || 0) !== 0 && (
            <span>{Math.floor(time?.diffDays || 0)} days </span>
          )}{" "}
          {Math.floor(time?.diffHrs || 0) !== 0 && (
            <span>{Math.floor(time?.diffHrs || 0)} hrs</span>
          )}{" "}
          {Math.floor(time?.diffMins || 0) !== 0 && (
            <span>{Math.floor(time?.diffMins || 0)} mins</span>
          )}{" "}
          ago.
        </p>

        <div className="">
          Reservation :{" "}
          <span className="text-sm font-bold">
            {new Intl.DateTimeFormat("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).formatRange(booking.startDate, booking.endDate)}
          </span>
        </div>
        <div className="font-semibold">
          {booking.paymentStatus ? (
            <p className="text-green-600">
              Paid ${booking.totalPrice} - Room reserved.
            </p>
          ) : (
            <p className="text-red-600">
              Not paid ${booking.totalPrice} - Room not reserved.
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <Link
            href={"/hotel/hotel-details/" + booking.hotelId}
            className="border md:py-2 py-1 md:px-4 px-3 hover:bg-gray-950 bg-zinc-900 text-zinc-50 rounded-full"
          >
            View hotel
          </Link>
          {!booking.paymentStatus && (
            <button
              className="border md:py-2 py-1 md:px-4 px-3 hover:bg-gray-950 bg-zinc-900 text-zinc-50 rounded-full"
              onClick={handleBookingRoom}
            >
              {loadingBook ? "Proccessing..." : "Pay now!"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
