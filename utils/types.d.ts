interface JWTPayloadTypes {
  userId: number;
  username: string;
  email: string;
}

interface ErrorPageTypes {
  error: { message: string };
  reset(): void;
}

interface JWTPayloadType {
  userId: number;
  username: string;
  email: string;
}

interface inputsRoomTypes {
  title: string;
  description: string;
  bedCount: number;
  guestCount: number;
  bathroomCount: number;
  kingBed: number;
  queenBed: number;
  image: null | File | string;
  breakFastPrice: number;
  roomPrice: number;
  roomservice: boolean;
  tv: boolean;
  balcony: boolean;
  freeWifi: boolean;
  cityView: boolean;
  mountainView: boolean;
  airCondition: boolean;
  soundProofed: boolean;
  hotelId?: string;
}
