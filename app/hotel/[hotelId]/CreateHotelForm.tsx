"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useLocations from "@/utils/useLocation";
import { ICity, IState } from "country-state-city";
import { LuPencil } from "react-icons/lu";
import Image from "next/image";
import { createHotelvalid, updateHotelvalid } from "@/utils/validation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DOMAIN } from "@/utils/CONSTANTS";
import { Hotel, Room } from "@prisma/client";
import { CgTrashEmpty } from "react-icons/cg";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import AddRoomForm from "@/components/AddRoomForm";

type hotelPropsType = Hotel & { rooms: Room[] };
function CreateHotelForm({ hotel }: { hotel?: hotelPropsType }) {
  const {
    getCountryStates,
    getStateCities,
    getCountries,
    getCountryByCode,
    getStateByCode,
  } = useLocations();
  const countries = getCountries();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  // inputs states
  const [data, setData] = useState({
    title: hotel?.title || "",
    description: hotel?.description || "",
    locationDescription: hotel?.locationDescription || "",
    gym: hotel?.gym || false,
    spa: hotel?.spa || false,
    restaurant: hotel?.restaurant || false,
    freeParking: hotel?.freeParking || false,
    bikeRental: hotel?.bikeRental || false,
    movieNights: hotel?.movieNights || false,
    swimmingPool: hotel?.swimmingPool || false,
    coffeeShop: hotel?.coffeeShop || false,
    laundry: hotel?.laundry || false,
    shopping: hotel?.shopping || false,
  });
  const [country, setCountry] = useState(
    getCountryByCode(hotel?.country || "")?.isoCode || ""
  );
  const [state, setState] = useState(
    getStateByCode(hotel?.country || "", hotel?.state || "")?.isoCode || ""
  );
  const [city, setCity] = useState("");
  const [image, setImage] = useState<null | File | string>(
    hotel?.imageUrl || null
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [messagesError, setMessagesError] = useState<{
    [prop: string]: string;
  }>({});

  useEffect(() => {
    if (!!country) {
      setStates(getCountryStates(country || ""));
    }
  }, [country]);

  useEffect(() => {
    if (!!country && !!state) {
      setCities(getStateCities(state, country));
      setCity("");
    }
  }, [state, country]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validate = !!hotel
        ? updateHotelvalid.safeParse({
            ...data,
            city,
            state,
            country,
            image,
          })
        : createHotelvalid.safeParse({
            ...data,
            city,
            state,
            country,
            image,
          });

      if (!(image instanceof File) && !hotel) {
        throw new Error("you must provide image!");
      }
      const messagesError: { [prop: string]: string } = {};
      if (!validate.success) {
        for (let i = 0; i < validate.error.errors.length; i++) {
          messagesError[validate.error.errors[i].path[0]] =
            validate.error.errors[i].message;
        }
      }

      setMessagesError(messagesError);

      const formData = new FormData();
      formData.append("state", state as string);
      formData.append("country", country as string);
      formData.append("city", city);
      formData.append("image", image!);
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
      }
      let response;
      if (hotel) {
        response = await fetch(`${DOMAIN}/api/hotel/${hotel.id}`, {
          method: "PUT",
          body: formData,
          // headers: {
          //   "content-type": "multipart/form-data",
          // },
        });
      } else {
        response = await fetch(`${DOMAIN}/api/hotel`, {
          method: "POST",
          body: formData,
          // headers: {
          //   "content-type": "multipart/form-data",
          // },
        });
      }
      if (!response.ok) {
        const details = await response.json();
        throw new Error(details.message);
      }
      const details = (await response.json()) as Hotel;
      toast.success("Hotel has been created successfully✅");
      return router.replace(`/hotel/${details.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteHotel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DOMAIN}/api/hotel/${hotel?.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const details = await response.json();
        throw new Error(details.message);
      }
      const details = await response.json();
      toast.success(`${details.message}✅`);
      return router.replace(`/`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="flex gap-20 w-full" onSubmit={handleSubmit}>
      <section className="flex-1 flex flex-col gap-8">
        <div className="flex-col flex ">
          <div>
            <label htmlFor="title" className="font-semibold mb-2 block">
              Hotel title *
            </label>
            <small className="block text-sm text-gray-400 mb-2">
              Provide your hotel name
            </small>
            <input
              type="text"
              name="title"
              id="title"
              className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
              value={data.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setData({ ...data, title: e.target.value });
              }}
            />
          </div>
          {!!messagesError.title && (
            <p className="text-red-500 text-[12px] font-bold pl-2">
              {messagesError.title}
            </p>
          )}
        </div>
        <div className="flex-col flex ">
          <div>
            <label htmlFor="description" className="font-semibold mb-2 block">
              Hotel description *
            </label>
            <small className="block text-sm text-gray-400 mb-2">
              Provide a deatail description of your hotel
            </small>
            <textarea
              name="description"
              id="description"
              rows={4}
              className="text-sm px-5 py-5  focus:outline-none border rounded-xl w-full text-gray-700 resize-none"
              value={data.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setData({ ...data, description: e.target.value });
              }}
            />
          </div>
          {!!messagesError.description && (
            <p className="text-red-500 text-[12px] font-bold pl-2">
              {messagesError.description}
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2 block">Choose Amenities *</h3>
          <small className="block text-sm text-gray-400 ">
            Choose Amentities popular in your hotel
          </small>
          <div className="flex justify-between items-center pt-4 px-4">
            <div className="flex gap-5 flex-col">
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="gym"
                  id="gym"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, gym: !ele.gym };
                    })
                  }
                  checked={data.gym}
                />
                <label htmlFor="gym" className="font-semibold ">
                  Gym
                </label>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="restaurant"
                  id="restaurant"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, restaurant: !ele.restaurant };
                    })
                  }
                  checked={data.restaurant}
                />
                <label htmlFor="restaurant" className="font-semibold ">
                  Restaurant
                </label>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="freeParking"
                  id="freeParking"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, freeParking: !ele.freeParking };
                    })
                  }
                  checked={data.freeParking}
                />
                <label htmlFor="freeParking" className="font-semibold ">
                  Free Parking
                </label>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="movieNights"
                  id="movieNights"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, movieNights: !ele.movieNights };
                    })
                  }
                  checked={data.movieNights}
                />
                <label htmlFor="movieNights" className="font-semibold ">
                  Movie nights
                </label>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="spa"
                  id="spa"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, spa: !ele.spa };
                    })
                  }
                  checked={data.spa}
                />
                <label htmlFor="spa" className="font-semibold ">
                  Spa
                </label>
              </div>
            </div>
            <div className="flex gap-5 flex-col">
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="laundry"
                  id="laundry"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, laundry: !ele.laundry };
                    })
                  }
                  checked={data.laundry}
                />
                <label htmlFor="laundry" className="font-semibold ">
                  Laundry Facilities
                </label>
              </div>

              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="shopping"
                  id="shopping"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, shopping: !ele.shopping };
                    })
                  }
                  checked={data.shopping}
                />
                <label htmlFor="shopping" className="font-semibold ">
                  Shopping
                </label>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="bikeRental"
                  id="bikeRental"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, bikeRental: !ele.bikeRental };
                    })
                  }
                  checked={data.bikeRental}
                />
                <label htmlFor="bikeRental" className="font-semibold ">
                  Bike Rental
                </label>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="swimmingPool"
                  id="swimmingPool"
                  className="text-sm px-4 py-3 focus:outline-none border rounded-xl  text-gray-700 scale-[1.35]"
                  onChange={() =>
                    setData((ele) => {
                      return { ...data, swimmingPool: !ele.swimmingPool };
                    })
                  }
                  checked={data.swimmingPool}
                />
                <label htmlFor="swimmingPool" className="font-semibold ">
                  Swimming Pool
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col flex ">
          <div>
            <small className="block text-sm text-gray-400 mb-4">
              Provide your hotel image
            </small>
            <label
              htmlFor="image"
              className="border-2 rounded-lg  w-full h-40 cursor-pointer text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center justify-center"
            >
              <span className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-slate-50">
                Upload a file
              </span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.files) return;
                  setImage(e.target.files?.[0]);
                }}
                className="sr-only"
              />
            </label>
            {!!messagesError.image && (
              <p className="text-red-500 text-[12px] font-bold pl-2">
                {messagesError.image}
              </p>
            )}
            <div className="w-40 h-80 mt-8">
              {image && (
                <Image
                  alt="img"
                  width={160}
                  height={320}
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="flex-1 flex flex-col gap-8">
        <div className="flex md:flex-row flex-col gap-8">
          <div className="flex-1">
            <div className="flex-col flex ">
              <label htmlFor="country" className="font-semibold mb-2 block">
                Selet country *
              </label>
              <small className="block text-sm text-gray-400 mb-2">
                In which country is your property located?
              </small>
              <select
                name="country"
                id="country"
                value={country as string}
                className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setCountry(e.target.value);
                  setCity("");

                  setState("");
                }}
              >
                <option value="" disabled>
                  Choose country
                </option>
                {countries.map((country, index) => {
                  return (
                    <option value={country.isoCode} key={index}>
                      {country.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {!!messagesError.country && (
              <p className="text-red-500 text-[12px] font-bold pl-2">
                {messagesError.country}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="state" className="font-semibold mb-2 block">
              Selet state
            </label>
            <small className="block text-sm text-gray-400 mb-2">
              In which state is your property located?
            </small>
            <select
              name="state"
              id="state"
              disabled={states.length === 0 || loading}
              className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
              value={state}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setState(e.target.value);
              }}
            >
              <option value="" disabled>
                Choose state (Optional)
              </option>
              {states.map((state, index) => {
                return (
                  <option value={state.isoCode} key={index}>
                    {state.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="city" className="font-semibold mb-2 block">
            Selet city
          </label>
          <small className="block text-sm text-gray-400 mb-2">
            In which city is your property located?
          </small>
          <select
            name="city"
            id="city"
            disabled={cities.length === 0 || loading}
            className="text-sm px-4 py-3 focus:outline-none border rounded-xl w-full text-gray-700"
            value={city}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setCity(e.target.value);
            }}
          >
            <option value="" disabled>
              Choose city (Optional)
            </option>
            {cities.map((city, index) => {
              return (
                <option value={city.stateCode} key={index}>
                  {city.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <div className="flex-col flex ">
            <label
              htmlFor="locationDescription"
              className="font-semibold mb-2 block"
            >
              Location description *
            </label>
            <small className="block text-sm text-gray-400 mb-2">
              Provide a deatail location description of your hotel
            </small>
            <textarea
              name="locationDescription"
              id="locationDescription"
              rows={4}
              className="text-sm px-5 py-5  focus:outline-none border rounded-xl w-full text-gray-700 resize-none"
              value={data.locationDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setData({ ...data, locationDescription: e.target.value });
              }}
            />
            {!!messagesError.country && (
              <p className="text-red-500 text-[12px] font-bold pl-2">
                {messagesError.country}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          {hotel && (
            <>
              <button
                className={`  ${loading && "cursor-not-allowed"}`}
                onClick={handleDeleteHotel}
                disabled={loading}
              >
                <CgTrashEmpty
                  size={20}
                  className="text-red-600 hover:text-red-700"
                />
              </button>

              <button
                className={`flex gap-2 items-center w-fit px-3 py-2 rounded-md text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 ${
                  loading && "cursor-not-allowed"
                }`}
                disabled={loading}
              >
                <MdOutlineRemoveRedEye size={16} />
                View
              </button>
              <button
                className={`flex gap-2 items-center w-fit px-3 py-2 rounded-md text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 ${
                  loading && "cursor-not-allowed"
                }`}
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                <IoIosAdd size={18} />
                Add room
              </button>
            </>
          )}
          <button
            className={`flex gap-2 items-center w-fit px-3 py-2 rounded-md text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors text-slate-50 ${
              loading && "cursor-not-allowed"
            }`}
            disabled={loading}
          >
            <LuPencil size={18} />
            {hotel ? "Update" : "Create"}
          </button>
        </div>
      </section>
      {open && <AddRoomForm hotel={hotel} setOpen={setOpen} />}
    </form>
  );
}

export default CreateHotelForm;
