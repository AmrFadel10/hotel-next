import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json({ messsage: "Login first" }, { status: 401 });
    }
    const { payment_intent_id, bookingData } = await req.json();
    const booking = {
      ...bookingData,
      userName: user.username,
      userEmail: user.email,
      userId: user.userId,
      currency: "usd",
      paymentIntentId: payment_intent_id,
    };

    let foundBooking;
    if (payment_intent_id) {
      foundBooking = await prisma.booking.findUnique({
        where: {
          paymentIntentId: payment_intent_id,
          userId: user.userId,
        },
      });
    }

    if (foundBooking && payment_intent_id) {
      //update
      const current_paymentIntent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );

      if (current_paymentIntent) {
        const updatePaymentIntent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: booking.totalPrice * 100,
            currency: "usd",
          }
        );

        const updateBooking = await prisma.booking.update({
          where: {
            userId: user.userId,
            paymentIntentId: payment_intent_id,
          },
          data: booking,
        });

        if (!updateBooking) {
          return NextResponse.error();
        }

        return NextResponse.json(updatePaymentIntent, { status: 201 });
      }
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.totalPrice * 100,
        currency: booking.currency,
        automatic_payment_methods: { enabled: true },
      });
      booking.paymentIntentId = paymentIntent.id;

      await prisma.booking.create({
        data: booking,
      });

      return NextResponse.json(paymentIntent, { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error!",
      },
      { status: 500 }
    );
  }
}
