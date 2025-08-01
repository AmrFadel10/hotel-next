import getBookingsByUserId from "@/app/my-bookings/getBookingsByUserId";
import { verifyToken } from "@/utils/verifyToken";
import { redirect } from "next/navigation";
import React from "react";
import BookingCard from "./BookingCard";

export default async function page() {
  const user = verifyToken();
  if (!user) {
    return redirect("/login");
  }
  const bookings = await getBookingsByUserId(user.userId);
  if (!bookings?.length) {
    return (
      <div className="text-base font-semibold text-gray-700 text-center w-full flex justify-center items-center flex-1">
        No bookings yet.
      </div>
    );
  }
  return (
    <main>
      <h2 className="md:font-extrabold font-semibold md:text-4xl text-xl mt-4 mb-10 text-gray-800">
        Here are bookings you have made:
      </h2>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-4">
        {bookings.map((booking, index) => {
          return <BookingCard key={index} booking={booking} />;
        })}
      </section>
    </main>
  );
}
