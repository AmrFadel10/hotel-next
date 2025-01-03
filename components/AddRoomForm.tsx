"use client";
import { DOMAIN } from "@/utils/CONSTANTS";
import { CreateRoomValid } from "@/utils/validation";
import { Hotel, Room } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { LuPencil } from "react-icons/lu";

interface HotelType extends Hotel {
  rooms: Room[];
}
type propsType = {
  hotel?: HotelType;
  room?: Room;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddRoomForm({ hotel, room, setOpen }: propsType) {
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );
  const router = useRouter();
  const [inputs, setInputs] = useState<inputsRoomTypes>({
    // This is your Prisma schema file,
    title: "",
    description: "",
    bedCount: 1,
    guestCount: 0,
    bathroomCount: 1,
    kingBed: 0,
    queenBed: 0,
    image: null,
    breakFastPrice: 5,
    roomPrice: 10,
    roomservice: false,
    tv: false,
    balcony: false,
    freeWifi: false,
    cityView: false,
    mountainView: false,
    airCondition: false,
    soundProofed: false,
    hotelId: hotel?.id,
  });

  if (!hotel) {
    return notFound();
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validate = CreateRoomValid.safeParse(inputs);
      const result: { [key: string]: string } = {};
      if (!validate.success) {
        validate.error.errors.map((error) => {
          result[error.path[0]] = error.message;
        });
        setErrorMessages(result);
      } else {
        //append inputs into form inputs
        const forminputs = new FormData();
        for (const [key, value] of Object.entries(inputs)) {
          forminputs.append(key, value);
        }

        const response = await fetch(`${DOMAIN}/api/room`, {
          method: "POST",
          body: forminputs,
        });

        const info = await response.json();

        if (!response.ok) {
          throw new Error(info.message);
        }
        setOpen(false);
        router.refresh();
        return toast.success(info.message);
      }
    } catch (error) {
      return toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="fixed w-full h-screen bg-blend-overlay bg-black/70 left-0 top-0 flex justify-center items-center z-10">
      <section className="w-[90%] max-w-[900px] rounded-lg md:py-8 py-3 md:px-8 px-2 shadow-md bg-gray-50 relative h-[70vh] overflow-y-auto">
        <IoIosClose
          className="absolute top-2 right-1 text-red-500 hover:text-red-700 cursor-pointer"
          size={38}
          onClick={() => setOpen(false)}
        />
        <h1 className="text-xl font-bold">
          {hotel && room ? "Update room" : "Add room"}
        </h1>
        <form className="flex flex-col gap-4 mt-4 ml-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="font-semibold mb-2 block">
              Room title *
            </label>
            <small className="block text-sm text-gray-400 mb-2">
              Provide your room name
            </small>
            <input
              type="text"
              name="title"
              id="title"
              className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
              value={inputs.title}
              onChange={(e) => {
                setInputs({ ...inputs, title: e.target.value });
              }}
            />
            {!!errorMessages.title && (
              <p className="text-red-500 text-[12px] font-bold pl-2">
                {errorMessages.title}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="font-semibold mb-2 block">
              Room description *
            </label>
            <small className="block text-sm text-gray-400 mb-2">
              Provide a deatail description of your room
            </small>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="text-sm px-3 py-3  focus:outline-none border rounded-xl w-full text-gray-700 resize-none"
              value={inputs.description}
              onChange={(e) => {
                setInputs({ ...inputs, description: e.target.value });
              }}
            />
            {!!errorMessages.description && (
              <p className="text-red-500 text-[12px] font-bold pl-2">
                {errorMessages.description}
              </p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2 block">Choose room Amenities</h3>
            <small className="block text-sm text-gray-400 ">
              What makes this room agood choice
            </small>
            <div className="flex justify-between items-center mx-2 mt-4 w-full gap-3">
              <div className="flex gap-3 flex-col flex-1">
                <div className=" flex-1">
                  <label
                    htmlFor="roomservice"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="roomservice"
                      id="roomservice"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, roomservice: !ele.roomservice };
                        })
                      }
                      checked={inputs.roomservice}
                    />
                    24hrs roomservice
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="tv"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="tv"
                      id="tv"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, tv: !ele.tv };
                        })
                      }
                      checked={inputs.tv}
                    />
                    TV
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="balcony"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="balcony"
                      id="balcony"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, balcony: !ele.balcony };
                        })
                      }
                      checked={inputs.balcony}
                    />
                    balcony
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="freeWifi"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="freeWifi"
                      id="freeWifi"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, freeWifi: !ele.freeWifi };
                        })
                      }
                      checked={inputs.freeWifi}
                    />
                    freeWifi
                  </label>
                </div>
              </div>
              <div className="flex gap-3 flex-col flex-1">
                <div className="flex-1">
                  <label
                    htmlFor="cityView"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="cityView"
                      id="cityView"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, cityView: !ele.cityView };
                        })
                      }
                      checked={inputs.cityView}
                    />
                    cityView
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="mountainView"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="mountainView"
                      id="mountainView"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, mountainView: !ele.mountainView };
                        })
                      }
                      checked={inputs.mountainView}
                    />
                    mountainView
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="airCondition"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="airCondition"
                      id="airCondition"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, airCondition: !ele.airCondition };
                        })
                      }
                      checked={inputs.airCondition}
                    />
                    airCondition
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="soundProofed"
                    className="font-semibold px-4 py-3 border rounded-md flex gap-3 items-center flex-1 capitalize hover:bg-gray-100 select-none  cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="soundProofed"
                      id="soundProofed"
                      className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.45]"
                      onChange={() =>
                        setInputs((ele) => {
                          return { ...inputs, soundProofed: !ele.soundProofed };
                        })
                      }
                      checked={inputs.soundProofed}
                    />
                    soundProofed
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <small className="block text-sm text-gray-400 mb-4">
              Provide your hotel image
            </small>
            <label
              htmlFor="image1"
              className="border-2 rounded-lg  w-full h-40 cursor-pointer text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center justify-center"
            >
              <span className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-slate-50">
                Upload a file
              </span>
              <input
                type="file"
                id="image1"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.files?.[0]) return;
                  setInputs({ ...inputs, image: e.target.files?.[0] });
                }}
                className="sr-only"
              />
            </label>
            {!!errorMessages.image && (
              <p className="text-red-500 text-[12px] font-bold pl-2">
                {errorMessages.image}
              </p>
            )}

            {inputs.image && (
              <div className="w-40 h-80 mt-8">
                <Image
                  alt="img"
                  width={160}
                  height={320}
                  src={
                    typeof inputs.image === "string"
                      ? inputs.image
                      : URL.createObjectURL(inputs.image)
                  }
                />
              </div>
            )}
          </div>
          <div className="flex justify-between  mx-2 mt-4 w-full gap-4">
            <div className="flex gap-3 flex-col flex-1">
              <div>
                <label htmlFor="roomPrice" className="font-semibold mb-2 block">
                  Room price in USD *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  State the price for staying in this room in 24hrs.
                </small>
                <input
                  type="number"
                  name="roomPrice"
                  id="roomPrice"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.roomPrice}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      roomPrice: parseInt(e.target.value),
                    });
                  }}
                />
                {!!errorMessages.roomPrice && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.roomPrice}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="roomPrice" className="font-semibold mb-2 block">
                  Breakfast price in USD *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  State the price for staying in this room in 24hrs.
                </small>
                <input
                  type="number"
                  name="breakFastPrice"
                  id="breakFastPrice"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.breakFastPrice}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      breakFastPrice: parseInt(e.target.value),
                    });
                  }}
                />
                {!!errorMessages.breakFastPrice && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.breakFastPrice}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="bedCount" className="font-semibold mb-2 block">
                  Beds count *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  How many beds are available in this room?
                </small>
                <input
                  type="number"
                  name="bedCount"
                  id="bedCount"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.bedCount}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      bedCount: parseInt(e.target.value),
                    });
                  }}
                />
                {!!errorMessages.bedCount && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.bedCount}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="guestCount"
                  className="font-semibold mb-2 block"
                >
                  Guests count *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  How many guests allowed in this room?
                </small>
                <input
                  type="number"
                  name="guestCount"
                  id="guestCount"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.guestCount}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      guestCount: parseInt(e.target.value),
                    });
                  }}
                />
                {!!errorMessages.guestCount && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.guestCount}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 flex-col flex-1">
              <div>
                <label
                  htmlFor="bathroomCount"
                  className="font-semibold mb-2 block"
                >
                  Bathroom count *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  How many bathrooms are available in this room?
                </small>
                <input
                  type="number"
                  name="bathroomCount"
                  id="bathroomCount"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.bathroomCount}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      bathroomCount: parseInt(e.target.value),
                    });
                  }}
                />
                {!!errorMessages.bathroomCount && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.bathroomCount}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="kingBed" className="font-semibold mb-2 block">
                  King beds count *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  How many king beds are available in this room?
                </small>
                <input
                  type="number"
                  name="kingBed"
                  id="kingBed"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.kingBed}
                  onChange={(e) => {
                    setInputs({ ...inputs, kingBed: parseInt(e.target.value) });
                  }}
                />
                {!!errorMessages.kingBed && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.kingBed}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="queenBed" className="font-semibold mb-2 block">
                  Queen beds count *
                </label>
                <small className="block text-sm text-gray-400 mb-2">
                  How many queen beds are available in this room?
                </small>
                <input
                  type="number"
                  name="queenBed"
                  id="queenBed"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                  value={inputs.queenBed}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      queenBed: parseInt(e.target.value),
                    });
                  }}
                />
                {!!errorMessages.queenBed && (
                  <p className="text-red-500 text-[12px] font-bold pl-2">
                    {errorMessages.queenBed}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            className={`flex gap-2 items-center w-fit px-3 py-2 rounded-md text-sm bg-indigo-600 hover:bg-indigo-800 transition-colors text-gray-50  ml-2 mt-4 font-bold ${
              loading && "cursor-not-allowed"
            }`}
            disabled={loading}
          >
            <LuPencil size={18} />
            {hotel ? "Update" : "Create"}
          </button>
        </form>
      </section>
    </main>
  );
}
