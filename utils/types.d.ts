interface JWTPayloadTypes {
  userId: number;
  username: string;
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
  bedCount: string;
  guestCount: string;
  bathroomCount: string;
  kingBed: string;
  queenBed: string;
  image: null | File | string;
  breakFastPrice: string;
  roomPrice: string;
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
