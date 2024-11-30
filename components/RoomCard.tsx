"use client";
import { Booking, Room } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { LuBed } from "react-icons/lu";
import { BiBath, BiEdit } from "react-icons/bi";
import { MdBalcony } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GiFoodTruck } from "react-icons/gi";
import { RiHome4Line } from "react-icons/ri";
import { GoMute } from "react-icons/go";
import { TbAirConditioning } from "react-icons/tb";
import { PiMountainsLight } from "react-icons/pi";
import { MdOutlineSignalWifi0Bar } from "react-icons/md";
import { usePathname } from "next/navigation";
import { CgTrashEmpty } from "react-icons/cg";
import { DOMAIN } from "@/utils/CONSTANTS";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { FaMagic } from "react-icons/fa";
import eachDayOfInterval from "@/utils/eachDayOfInterval";

export default function RoomCard({
  room,
  hotelId,
  hotelOwnerId,
  bookings,
}: {
  room: Room;
  hotelId?: string;
  hotelOwnerId?: number;
  bookings?: Booking[];
}) {
  const hotelDetails = usePathname().includes("hotel-details");
  const myHotels = usePathname().includes("my-hotels");
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [open, setOpen] = useState(false);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [days, setDays] = useState(1);

  const router = useRouter();

  const [date, setDate] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    key: "selection",
  });

  //diabled Dates to make it disable from calendar
  const disabledDate = useMemo(() => {
    let dates: Date[] = [];
    const bookingsByRoomId = bookings?.filter((booking) => {
      return booking.roomId === room.id;
    });
    bookingsByRoomId?.forEach((booking) => {
      const range = eachDayOfInterval({
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [bookings]);
  const handleDeleteRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DOMAIN}/api/room/${room?.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const details = await response.json();
        throw new Error(details.message);
      }
      const details = await response.json();
      toast.success(`${details.message}✅`);
      return router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookingRoom = async () => {
    try {
      if (!hotelId || !hotelOwnerId) {
        router.push("/404");
        return;
      }
      if (!!date.startDate && date.endDate) {
        setLoadingBook(true);
        const response = await fetch(`${DOMAIN}/api/create-payment-intent`, {
          method: "POST",
          body: JSON.stringify({
            bookingData: {
              roomId: room.id,
              hotelId,
              hotelOwnerId: `${hotelOwnerId}`,
              breakfastIncluded: includeBreakfast,
              totalPrice,
              startDate: date.startDate,
              endDate: date.endDate,
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
              roomId: room.id,
              hotelId,
              hotelOwnerId: `${hotelOwnerId}`,
              breakfastIncluded: includeBreakfast,
              totalPrice,
              startDate: date.startDate,
              endDate: date.endDate,
            },
            payment: {
              clientSecret: dataPayment.client_secret,
              paymentIntentId: dataPayment.id,
            },
            room,
          })
        );
        return router.replace("/book-room");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoadingBook(false);
    }
  };

  useEffect(() => {
    if (date && date.startDate && date.endDate) {
      const countDays =
        (date.endDate.getTime() - date.startDate.getTime()) /
        (1000 * 24 * 60 * 60);
      setDays(countDays);
      if (room.roomPrice && countDays) {
        if (includeBreakfast && room.breakFastPrice) {
          setTotalPrice(countDays * (room.roomPrice + room.breakFastPrice));
        } else {
          setTotalPrice(countDays * room.roomPrice);
        }
      }
    }
  }, [includeBreakfast, date, room.breakFastPrice]);
  return (
    <article className="p-6 rounded-lg flex flex-col gap-4  border shadow-md">
      <h3 className="text-xl font-bold break-words line-clamp-1">
        {room.title}
      </h3>
      <p className="text-gray-500 text-sm break-words line-clamp-2">
        {room.description}
      </p>
      <div className="h-52  relative overflow-hidden rounded-xl">
        <Image
          alt={"roomcard"}
          src={room.imageUrl}
          width={200}
          height={200}
          className="w-full h-full"
        />
      </div>
      <div className="flex gap-4 justify-between p-2  min-h-44">
        <div className="flex-1 flex gap-3 flex-col">
          {!!room.bedCount && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <LuBed size={20} />
              {room.bedCount} bed(s)
            </div>
          )}
          {!!room.bathroomCount && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <BiBath size={20} />
              {room.bathroomCount} bathroom(s)
            </div>
          )}
          {!!room.queenBed && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <LuBed size={20} />
              {room.queenBed} Queen bed(s)
            </div>
          )}
          {!!room.balcony && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <MdBalcony size={20} />
              {room.balcony} Balcony
            </div>
          )}
          {!!room.airCondition && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <TbAirConditioning size={20} />
              {room.airCondition} Aircondition
            </div>
          )}
          {!!room.mountainView && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <PiMountainsLight size={20} />
              {room.mountainView} Mountainview
            </div>
          )}
        </div>
        <div className="flex-1 flex gap-3 flex-col">
          {!!room.kingBed && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <LuBed size={20} />
              {room.kingBed} King bed(s)
            </div>
          )}
          {!!room.freeWifi && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <MdOutlineSignalWifi0Bar size={20} />
              {room.freeWifi} King bed(s)
            </div>
          )}
          {!!room.guestCount && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <FiUsers size={18} />
              {room.guestCount} Guest(s)
            </div>
          )}
          {!!room.roomservice && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <GiFoodTruck size={20} />
              {room.roomservice} Room service
            </div>
          )}
          {!!room.cityView && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <RiHome4Line size={20} />
              {room.cityView} Room service
            </div>
          )}
          {!!room.soundProofed && (
            <div className="flex gap-2 items-center font-semibold text-sm">
              <GoMute size={20} />
              {room.soundProofed} Room service
            </div>
          )}
        </div>
      </div>
      <div className="py-2 border-y  flex justify-between">
        <div className=" text-sm text-left">
          Room price:
          <span className="font-bold">${room.roomPrice}/24h</span>
        </div>
        <div className=" text-sm text-left">
          Breakfast price:{" "}
          <span className="font-bold">${room.breakFastPrice}</span>/24h
        </div>
      </div>
      <div>
        {hotelDetails && (
          <div className="flex flex-col w-full">
            <div className="w-full relative">
              <h4 className="font-semibold mb-3 block">
                Select days that you will spend in this room:
              </h4>
              <div className="flex gap-4 bg-gray-100 p-3 rounded-lg mb-2">
                <span
                  className="bg-white rounded-md p-1 flex-1 text-center"
                  onClick={() => setOpen((pre) => !pre)}
                >
                  From:{" "}
                  <span className="text-xs font-bold">
                    {date.startDate?.toLocaleDateString()}
                  </span>
                </span>
                <span
                  className="bg-white rounded-md p-1 flex-1 text-center"
                  onClick={() => setOpen((pre) => !pre)}
                >
                  To:{" "}
                  <span className="text-xs font-bold">
                    {date.endDate?.toLocaleDateString()}
                  </span>
                </span>
              </div>
              <DateRange
                rangeColors={["#262626"]}
                onChange={(item: RangeKeyDict) => setDate(item.selection)}
                months={1}
                minDate={new Date()}
                ranges={[date]}
                disabledDates={disabledDate}
                direction="horizontal"
                className={`mx-auto block w-fit ${
                  open ? "!flex" : "!hidden"
                } absolute bottom-16 -left-3 border rounded-lg p-1`}
              />
            </div>
            {!!room.breakFastPrice && (
              <div className="flex flex-col gap-2 my-5">
                <h4 className="font-semibold mb-1 block">
                  Do you want to be served breakfast each day:
                </h4>
                <div className="flex gap-2 pl-2">
                  <input
                    type="checkbox"
                    name={`want-breakfast-${room.id}`}
                    id={`want-breakfast-${room.id}`}
                    className="scale-125"
                    onChange={() => setIncludeBreakfast((pre) => !pre)}
                  />
                  <label
                    htmlFor={`want-breakfast-${room.id}`}
                    className="cursor-pointer text-sm font-semibold "
                  >
                    Include breakfast
                  </label>
                </div>
              </div>
            )}
            <div className="text-base my-4">
              Total price: <span className="font-bold">${totalPrice} </span>
              for <span className="font-bold">{days} Days.</span>
            </div>
            <button
              className={`${
                days <= 0
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-slate-900 hover:bg-slate-950"
              } mx-auto  flex gap-2 items-center justify-center border  rounded-lg w-3/4 py-2 text-slate-100`}
              disabled={days <= 0 || loadingBook}
              onClick={handleBookingRoom}
            >
              <FaMagic size={15} />
              {loadingBook ? "Processing" : "Book room!"}
            </button>
          </div>
        )}
        {myHotels && (
          <div className=" flex justify-between">
            <button
              className={`text-xs flex gap-1 items-center font-semibold cursor-pointer p-1 hover:underline  ${
                loading && "cursor-not-allowed"
              }`}
              onClick={handleDeleteRoom}
              disabled={loading}
            >
              <CgTrashEmpty
                size={18}
                className="text-red-600 hover:text-red-700"
              />{" "}
              Delete
            </button>
            <button
              className={`text-xs flex gap-1 items-center font-semibold cursor-pointer p-1 hover:underline  ${
                loading && "cursor-not-allowed"
              }`}
              onClick={handleDeleteRoom}
              disabled={loading}
            >
              <BiEdit
                size={18}
                className="text-green-600 hover:text-green-700"
              />{" "}
              Edit
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
