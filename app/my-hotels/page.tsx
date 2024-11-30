import { verifyToken } from "@/utils/verifyToken";
import { redirect } from "next/navigation";
import React from "react";
import { myHotelsById } from "./my-hotels";
import HotelCard from "@/components/HotelCard";

export default async function page() {
  const user = verifyToken();
  if (!user) return redirect("/");
  const hotels = await myHotelsById(user.userId);
  if (!hotels) throw Error("something went wrong");
  if (hotels.length === 0) {
    return (
      <section className="flex justify-center items-center w-full h-full text-zinc-600">
        You don{"'"}t have hotels yet!
      </section>
    );
  } else {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start py-8 gap-4">
        <h2 className="mb-4 md:text-3xl text-xl font-bold border-b pb-3 w-fit">
          My hotels:-
        </h2>
        {hotels.map((hotel, index) => {
          return <HotelCard hotel={hotel} key={index} />;
        })}
      </section>
    );
  }
}
