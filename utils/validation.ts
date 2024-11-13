import { z } from "zod";

//user validations
//create
export const createUservalid = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email()
    .min(3, "email must be above 2 characters")
    .max(50, "email must be lower than 50"),
  username: z
    .string({ required_error: "username is required" })
    .min(3, "username must be above 2 characters")
    .max(30, "username must be lower than 30"),
  password: z
    .string({ required_error: "password is required" })
    .min(3, "password must be above 2 characters")
    .max(16, "password must be lower than 16"),
});

//login
export const loginUservalid = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email()
    .min(3, "email must be above 2 characters")
    .max(50, "email must be lower than 50"),
  password: z
    .string({ required_error: "password is required" })
    .min(3, "password must be above 2 characters")
    .max(16, "password must be lower than 16"),
});

// hotel validations
export const createHotelvalid = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(2, "Title must be above or equal 2 characters")
    .max(120, "Title must be lower than 120 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(50, "Description must be above or equal 50 characters")
    .max(500, "Description must be lower than 500 characters"),
  country: z
    .string({ required_error: "Country is required" })
    .min(2, "Country must be above or equal 2 characters")
    .max(120, "Country must be lower than 50 characters"),
  city: z
    .string()
    .min(2, "City must be above or equal 2 characters")
    .max(120, "City must be lower than 50 characters")
    .optional(),
  state: z
    .string()
    .min(2, "State must be above or equal 2 characters")
    .max(120, "State must be lower than 50 characters")
    .optional(),
  locationDescription: z
    .string()
    .min(2, "Location description must be above or equal 2 characters")
    .max(200, "Location description must be lower than 200 characters"),
  gym: z.coerce.boolean().optional(),
  spa: z.coerce.boolean().optional(),
  laundry: z.coerce.boolean().optional(),
  restaurant: z.coerce.boolean().optional(),
  shopping: z.coerce.boolean().optional(),
  freeParking: z.coerce.boolean().optional(),
  bikeRental: z.coerce.boolean().optional(),
  freeWifi: z.coerce.boolean().optional(),
  movieNights: z.coerce.boolean().optional(),
  swimmingPool: z.coerce.boolean().optional(),
  coffeeShop: z.coerce.boolean().optional(),
});

export const updateHotelvalid = z.object({
  title: z
    .string()
    .min(2, "Title must be above or equal 2 characters")
    .max(120, "Title must be lower than 120 characters")
    .optional(),
  description: z
    .string()
    .min(50, "Title must be above or equal 50 characters")
    .max(500, "Title must be lower than 500 characters")
    .optional(),
  country: z
    .string()
    .min(2, "Country must be above or equal 2 characters")
    .max(120, "Country must be lower than 50 characters")
    .optional(),
  city: z
    .string()
    .min(2, "City must be above or equal 2 characters")
    .max(120, "City must be lower than 50 characters")
    .optional(),
  state: z
    .string()
    .min(2, "State must be above or equal 2 characters")
    .max(120, "State must be lower than 50 characters")
    .optional(),
  locationDescription: z
    .string()
    .min(2, "Location description must be above or equal 2 characters")
    .max(120, "Location description must be lower than 50 characters")
    .optional(),
  gym: z.coerce.boolean().optional(),
  spa: z.coerce.boolean().optional(),
  laundry: z.coerce.boolean().optional(),
  restaurant: z.coerce.boolean().optional(),
  shopping: z.coerce.boolean().optional(),
  freeParking: z.coerce.boolean().optional(),
  bikeRental: z.coerce.boolean().optional(),
  freeWifi: z.coerce.boolean().optional(),
  movieNights: z.coerce.boolean().optional(),
  swimmingPool: z.coerce.boolean().optional(),
  coffeeShop: z.coerce.boolean().optional(),
});

//Room validation

export const CreateRoomValid = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be contain at least 3 letters")
    .max(100, "Title must be maximum 100 letters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(50, "Description must be contain at least 50 letters")
    .max(500, "Description must be maximum 500 letters"),
  bedCount: z.coerce
    .number({ required_error: "Bed Count is required" })
    .min(1, "Bed must be at least 1 bed")
    .max(3, "Bed count maximum 3 beds"),
  guestCount: z.coerce
    .number({ required_error: "Guest Count is required" })
    .min(1, "Guest bed must be at least 1 bed")
    .max(3, "Guest count maximum 3 beds")
    .optional(),
  bathroomCount: z.coerce
    .number({ required_error: "Bathroom Count is required" })
    .min(1, "Bathroom Count must be at least 1 bed")
    .max(3, "Bathroom count maximum 3 beds"),
  kingBed: z.coerce
    .number({ required_error: "king bed count is required" })
    .min(1, "king bed Count must be at least 1 bed")
    .max(3, "king bed count maximum 3 beds")
    .optional(),
  queenBed: z.coerce
    .number({ required_error: "Queen bed count is required" })
    .min(1, "Queen bed Count must be at least 1 bed")
    .max(3, "Queen bed count maximum 3 beds")
    .optional(),
  image: z.union([
    z.string({ required_error: "image is required" }),
    z
      .instanceof(File, { message: "Image must be File" })
      .refine(
        (file) => file.type.startsWith("image"),
        "Image must be File(image)"
      ),
  ]),
  breakFastPrice: z.coerce
    .number({ required_error: "breakfast price is required" })
    .min(5, "breakfast price must be minimum $5")
    .max(50, "breakfast price must be maximum $50"),
  roomPrice: z.coerce
    .number({ required_error: "Room price is required" })
    .min(5, "Room pric must be minimum $10")
    .max(50, "Room pric must be maximum $5000"),
  roomservice: z.coerce
    .boolean({
      invalid_type_error: "Room service must be boolean value!",
    })
    .optional(),
  tv: z.coerce
    .boolean({
      invalid_type_error: "Tv service must be boolean value!",
    })
    .optional(),
  balcony: z.coerce
    .boolean({
      invalid_type_error: "balcony service must be boolean value!",
    })
    .optional(),
  freeWifi: z.coerce
    .boolean({
      invalid_type_error: "Free Wifi service must be boolean value!",
    })
    .optional(),
  cityView: z.coerce
    .boolean({
      invalid_type_error: "City view service must be boolean value!",
    })
    .optional(),
  mountainView: z.coerce
    .boolean({
      invalid_type_error: "Mountain View service must be boolean value!",
    })
    .optional(),
  airCondition: z.coerce
    .boolean({
      invalid_type_error: "AirCondition service must be boolean value!",
    })
    .optional(),
  soundProofed: z.coerce
    .boolean({
      invalid_type_error: "SoundProofed service must be boolean value!",
    })
    .optional(),
  hotelId: z.string({
    required_error: "hotel id is reqiured",
    invalid_type_error: "hotel id must be string",
  }),
});

export const UpdateRoomValid = z.object({
  title: z
    .string()
    .min(3, "Title must be contain at least 3 letters")
    .max(100, "Title must be maximum 100 letters")
    .optional(),
  description: z
    .string()
    .min(50, "Description must be contain at least 50 letters")
    .max(500, "Description must be maximum 500 letters")
    .optional(),
  bedCount: z.coerce
    .number()
    .min(1, "Bed must be at least 1 bed")
    .max(3, "Bed count maximum 3 beds")
    .optional(),
  guestCount: z.coerce
    .number()
    .min(0, "Guest bed must be at least 0 bed")
    .max(3, "Guest count maximum 3 beds")
    .optional(),
  bathroomCount: z.coerce
    .number()
    .min(1, "Bathroom Count must be at least 1 bed")
    .max(3, "Bathroom count maximum 3 beds")
    .optional(),
  kingBed: z.coerce
    .number()
    .min(1, "king bed Count must be at least 1 bed")
    .max(3, "king bed count maximum 3 beds")
    .optional(),
  queenBed: z.coerce
    .number()
    .min(1, "Queen bed Count must be at least 1 bed")
    .max(3, "Queen bed count maximum 3 beds")
    .optional(),
  image: z
    .union([
      z.string({ required_error: "image is required" }).optional(),
      z
        .instanceof(File, { message: "Image must be File" })
        .refine(
          (file) => file.type.startsWith("image"),
          "Image must be File(image)"
        ),
    ])
    .optional(),
  breakFastPrice: z.coerce
    .number()
    .min(5, "breakfast price must be minimum $5")
    .max(50, "breakfast price must be maximum $50")
    .optional(),
  roomPrice: z.coerce
    .number()
    .min(5, "Room pric must be minimum $10")
    .max(50, "Room pric must be maximum $5000")
    .optional(),
  roomservice: z.coerce
    .boolean({
      invalid_type_error: "Room service must be boolean value!",
    })
    .optional(),
  tv: z.coerce
    .boolean({
      invalid_type_error: "Tv service must be boolean value!",
    })
    .optional(),
  balcony: z.coerce
    .boolean({
      invalid_type_error: "balcony service must be boolean value!",
    })
    .optional(),
  freeWifi: z.coerce
    .boolean({
      invalid_type_error: "Free Wifi service must be boolean value!",
    })
    .optional(),
  cityView: z.coerce
    .boolean({
      invalid_type_error: "City view service must be boolean value!",
    })
    .optional(),
  mountainView: z.coerce
    .boolean({
      invalid_type_error: "Mountain View service must be boolean value!",
    })
    .optional(),
  airCondition: z.coerce
    .boolean({
      invalid_type_error: "AirCondition service must be boolean value!",
    })
    .optional(),
  soundProofed: z.coerce
    .boolean({
      invalid_type_error: "SoundProofed service must be boolean value!",
    })
    .optional(),
  hotelId: z
    .string({
      invalid_type_error: "hotel id must be string",
    })
    .optional(),
});
