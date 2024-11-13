import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { pushImage, removeImage } from "@/utils/cloudinary";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateRoomValid } from "@/utils/validation";

/**
 * @access private
 * @method PUT
 * @desc   update a room
 * @route  ~/api/room
 */

export async function PUT(req: NextRequest, { id }: { id: string }) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json({ message: "Login first" }, { status: 401 });
    }
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 400 });
    }

    const body = await req.formData();
    const obj: { [key: string]: string | number | null | boolean | File } = {};
    for (const [key, value] of body.entries()) {
      if (typeof value === "string") {
        if (value === "") {
          obj[key] = null;
        } else if (typeof parseInt(value) === "number") {
          obj[key] = parseInt(value);
        } else {
          obj[key] = value;
        }
      } else {
        obj[key] = value;
      }
    }

    //validation
    const validate = UpdateRoomValid.safeParse(obj);
    if (!validate.success) {
      return NextResponse.json(
        { message: validate.error.errors[0].message },
        { status: 400 }
      );
    }
    if (typeof obj.image === "string") {
      obj.image = null;
    }
    let imageInfo;
    if (!!obj.image) {
      await removeImage(room.imageId);
      imageInfo = await pushImage(obj.image as File);
    } else {
      return NextResponse.json(
        { message: "No image provided!" },
        { status: 400 }
      );
    }
    await prisma.room.update({
      where: { id },
      data: {
        title: obj.title as string,
        description: obj.description as string,
        bedCount: obj.bedCount as number,
        guestCount: obj.guestCount as number,
        bathroomCount: obj.bathroomCount as number,
        kingBed: obj.kingBed as number,
        queenBed: obj.queenBed as number,
        imageId: imageInfo?.public_id as string,
        imageUrl: imageInfo?.secure_url as string,
        breakFastPrice: obj.breakFastPrice as number,
        roomPrice: obj.roomPrice as number,
        roomservice: obj.roomservice as boolean,
        tv: obj.tv as boolean,
        balcony: obj.balcony as boolean,
        freeWifi: obj.freeWifi as boolean,
        cityView: obj.cityView as boolean,
        mountainView: obj.mountainView as boolean,
        airCondition: obj.airCondition as boolean,
        soundProofed: obj.soundProofed as boolean,
      },
    });

    return NextResponse.json(
      { message: "Room has been updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    const messageError =
      error instanceof Error ? error.message : "Internal server error!";
    NextResponse.json({ message: messageError }, { status: 500 });
  }
}
