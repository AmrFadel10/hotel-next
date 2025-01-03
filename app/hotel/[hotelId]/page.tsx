import React from "react";
import CreateHotelForm from "./CreateHotelForm";
import getHotel from "../getHotel";
import { verifyToken } from "@/utils/verifyToken";
import { redirect } from "next/navigation";

interface propsType {
  params: {
    hotelId: string;
  };
}

export default async function page({ params: { hotelId } }: propsType) {
  const user = verifyToken();
  if (!user) return redirect("/");
  let hotel;
  if (hotelId !== "create" && hotelId !== "") {
    hotel = await getHotel({ hotelId });
  }
  // const rooms = await getRoomsByHotel(hotelId);
  // if(user.userId !== hotel.)
  return (
    <section className="w-full">
      <h2 className="mb-6 md:text-3xl text-xl font-bold border-b pb-3 w-fit">
        {hotelId !== "create" && hotelId !== "" ? "Edit" : "Create"} your hotel!
      </h2>
      {hotel ? <CreateHotelForm hotel={hotel} /> : <CreateHotelForm />}
    </section>
  );
}
