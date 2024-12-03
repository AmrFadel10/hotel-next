import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const pushImage = async (file: File) => {
  if (!file) {
    throw new Error("No image file provided");
  }

  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Create a base64 string from the buffer
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;
    return await cloudinary.uploader.upload(base64String, {
      resource_type: "auto",
      folder: "hotels",
    });
  } catch (error) {
    console.log(
      error instanceof Error
        ? `Image upload failed: ${error.message}`
        : "Image upload failed with unknown error"
    );
  }
};

export const removeImage = async (pathImage: string) => {
  try {
    if (!pathImage) {
      throw new Error("No image path provided");
    }

    return await cloudinary.uploader.destroy(pathImage, {
      resource_type: "auto",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Image delete failed with unknown error";
    NextResponse.json(message, { status: 500 });
  }
};
