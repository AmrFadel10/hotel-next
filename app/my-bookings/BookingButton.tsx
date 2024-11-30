"use client";
import { DOMAIN } from "@/utils/CONSTANTS";
import { Booking, Hotel, Room } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function BookingButton({
  booking,
}: {
  booking: Booking & { Room: Room; Hotel: Hotel };
}) {
  const [loadingBook, setLoadingBook] = useState(false);
  const router = useRouter();

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
  return (
    <button
      className="border py-2 px-4 hover:bg-gray-100 rounded"
      onClick={handleBookingRoom}
    >
      {loadingBook ? "Proccessing..." : "Pay now!"}
    </button>
  );
}
