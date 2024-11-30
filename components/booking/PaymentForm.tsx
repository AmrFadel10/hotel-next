import { DOMAIN } from "@/utils/CONSTANTS";
import { Room } from "@prisma/client";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

export default function PaymentForm({
  clientSecret,
  bookingRoomData,
  bookingData,
  setPaymentSuccess,
}: {
  clientSecret: string;
  bookingRoomData: Room;
  bookingData: { [key: string]: string };
  setPaymentSuccess: Dispatch<SetStateAction<boolean>>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!stripe) return;
    if (!clientSecret) return;
    setPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !bookingRoomData) {
      return;
    }
    setIsLoading(true);
    stripe
      .confirmPayment({ elements, redirect: "if_required" })
      .then((result) => {
        if (!result.error) {
          fetch(`${DOMAIN}/api/booking/${result.paymentIntent.id}`, {
            method: "PUT",
          })
            .then(() => {
              toast.success("Room reserved");
              localStorage.removeItem("payment");
              setPaymentSuccess(true);
              return;
            })
            .catch((error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Internal server error!"
              );
              return;
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="my-2 text-lg">Billing address:</h3>
      <AddressElement
        options={{
          mode: "billing",
          // allowedCountries:[]
        }}
      />
      <h3 className="my-2 text-lg">Payment information</h3>
      <PaymentElement options={{ layout: "tabs" }} />

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold my-4">Your booking summary</h3>
          <div className="text-base text-gray-800 font-semibold">
            You will check-in on{" "}
            {new Date(bookingData.startDate).toLocaleDateString("en-us", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at 5pm
          </div>
          <div className="text-base text-gray-800 font-semibold">
            You will check-in on{" "}
            {new Date(bookingData.endDate).toLocaleDateString("en-us", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            at 5pm
          </div>
          {!!bookingRoomData.breakFastPrice && (
            <div className="text-base text-gray-800 font-semibold">
              you will be served breakfast each day at 8am
            </div>
          )}
        </div>
        <hr />
        <div className="flex flex-col gap-1">
          {!!bookingRoomData.breakFastPrice && (
            <div className="text-base text-gray-800 font-semibold">
              Breakfast price :{" "}
              <span className="font-bold">
                ${bookingRoomData.breakFastPrice}
              </span>
            </div>
          )}
          {!!bookingData.totalPrice && (
            <div className="text-base text-gray-800 font-semibold">
              Total price :{" "}
              <span className="font-bold">${bookingData.totalPrice}</span>
            </div>
          )}
        </div>
      </div>
      <button
        disabled={isLoading}
        className="px-4 py-2 border focus:outline-none bg-slate-900 text-slate-50 hover:bg-slate-950 rounded-md mx-auto block mt-8"
      >
        {isLoading ? "Processing payment..." : "Pay now!"}
      </button>
    </form>
  );
}
