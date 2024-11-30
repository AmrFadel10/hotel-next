import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { updateHotelvalid } from "@/utils/validation";
import { pushImage, removeImage } from "@/utils/cloudinary";

/**
 * @route   ~/api/hotel/:id
 * @desc    update a hotel
 * @method  POST
 * @access  private
 */

export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const body = await request.formData();
    const obj: { [key: string]: string | boolean } = {};
    for (const [key, value] of body) {
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
    const checkHotel = await prisma.hotel.findUnique({ where: { id } });
    if (!checkHotel) {
      return NextResponse.json(
        { message: "The hotel not found!" },
        { status: 404 }
      );
    }
    const validate = updateHotelvalid.safeParse(obj);
    if (!validate.success) {
      return NextResponse.json(
        { message: validate.error.errors[0].message },
        { status: 400 }
      );
    }
    //edit image
    const imageBody = body.get("image") as File;
    let result;
    if (imageBody instanceof File) {
      await removeImage(checkHotel.imageId);
      result = await pushImage(imageBody);
      if (!result)
        return NextResponse.json(
          { message: "No image provided, access denied" },
          { status: 400 }
        );
    }

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        userId: 1,
        title: obj.title as string,
        description: obj.description as string,
        imageId: result?.public_id as string,
        imageUrl: result?.secure_url as string,
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
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

/**
 * @route   ~/api/hotel/:id
 * @desc    delete a hotel
 * @method  DELETE
 * @access  private
 */

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
    });
    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 400 });
    }
    await removeImage(hotel.imageId);
    await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel has been deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

/**
 * @route   ~/api/hotel/:id
 * @desc    delete a hotel
 * @method  GET
 * @access  public
 */

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
    });
    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 400 });
    }

    return NextResponse.json(hotel, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
