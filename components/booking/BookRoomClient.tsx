"use client";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import RoomCard from "../RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { redirect, useRouter } from "next/navigation";
import Loading from "@/app/loading";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function BookRoomClient() {
  const [bookingRoomData, setBookingRoomData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  useEffect(() => {
    setIsUploaded(true);
    const payemntData = localStorage.getItem("payment");
    if (!!payemntData) {
      const parsedData = JSON.parse(payemntData);
      setBookingRoomData(parsedData.room);
      setBookingData(parsedData.bookingData);
      setClientSecret(parsedData.payment.clientSecret);
    }
  }, []);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret,
  };
  if (paymentSuccess) {
    return (
      <section className="w-full flex justify-center items-center flex-col gap-6 ">
        <div className="font-bold">Payment success</div>
        <button
          className="px-4 py-2 border focus:outline-none bg-slate-900 text-slate-50 hover:bg-slate-950 rounded-md mx-auto block mt-8"
          onClick={() => router.push("/my-bookings")}
        >
          View bokings
        </button>
      </section>
    );
  }
  if (!isUploaded) {
    return <Loading />;
  }
  return (
    <section>
      {!!bookingRoomData && !!clientSecret && !!bookingData ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">
            Complete payment to reserve this room:
          </h2>
          <div className=" md:w-1/2 mx-auto">
            <RoomCard room={bookingRoomData} />
          </div>
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              clientSecret={clientSecret}
              bookingRoomData={bookingRoomData}
              bookingData={bookingData}
              setPaymentSuccess={setPaymentSuccess}
            />
          </Elements>
        </>
      ) : (
        redirect("/")
      )}
    </section>
  );
}
