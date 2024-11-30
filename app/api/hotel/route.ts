import { NextRequest, NextResponse } from "next/server";
import { createHotelvalid } from "../../../utils/validation";
import prisma from "@/utils/db";
import { pushImage } from "@/utils/cloudinary";
import { verifyToken } from "@/utils/verifyToken";

/**
 * @route   ~/api/hotel/
 * @desc    create a hotel
 * @method  POST
 * @access  private
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const user = verifyToken();
    if (!user || !user.userId) {
      return NextResponse.json({ message: "Login first" }, { status: 401 });
    }
    if (!body.get("image")) {
      return NextResponse.json(
        { message: "No image provided, access denied" },
        { status: 400 }
      );
    }
    const obj: { [key: string]: string | boolean } = {};
    for (const [key, value] of body.entries()) {
      if (typeof value === "string" && value !== "") {
        if (value === "true") {
          obj[key] = true;
        } else if (value === "false") {
          obj[key] = false;
        } else {
          obj[key] = value;
        }
      }
    }
    const validate = createHotelvalid.safeParse(obj);
    if (!validate.success) {
      return NextResponse.json(
        { message: validate.error.errors[0].message },
        { status: 400 }
      );
    }

    //uploading images
    const image = body.get("image") as File;
    const result = await pushImage(image);
    if (!result) {
      throw new Error("Upload failed - no result returned");
    }
    const hotel = await prisma.hotel.create({
      data: {
        userId: user.userId,
        title: obj.title as string,
        description: obj.description as string,
        imageUrl: result.secure_url,
        imageId: result.public_id,
        country: obj.country as string,
        city: obj.city as string,
        state: obj.state as string,
        locationDescription: obj.locationDescription as string,
        gym: obj.gym as boolean,
        spa: obj.spa as boolean,
        laundry: obj.laundry as boolean,
        restaurant: obj.restaurant as boolean,
        shopping: obj.shopping as boolean,
        freeParking: obj.freeParking as boolean,
        bikeRental: obj.bikeRental as boolean,
        movieNights: obj.movieNights as boolean,
        swimmingPool: obj.swimmingPool as boolean,
        coffeeShop: obj.coffeeShop as boolean,
      },
    });
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
