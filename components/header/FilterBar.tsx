"use client";
import { CreateQueryString } from "@/utils/QueryString";
import useLocations from "@/utils/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function FilterBar() {
  const {
    getCountries,
    getCountryByCode,
    getCountryStates,
    getStateByCode,
    getStateCities,
  } = useLocations();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [states, setStates] = useState<IState[]>();
  const [cities, setCities] = useState<ICity[]>();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const countries = getCountries();

  useEffect(() => {
    if (!!country) {
      setStates(getCountryStates(country));
      router.push(
        `${pathName}?${CreateQueryString(searchParams, "country", country)}`
      );
      setState("");
      setCity("");
    }
  }, [country, pathName]);

  useEffect(() => {
    if (!!country && !!state) {
      setCities(getStateCities(state, country));
      router.push(
        `${pathName}?${CreateQueryString(searchParams, "state", state)}`
      );
      setCity("");
    }
  }, [country, state, pathName]);

  useEffect(() => {
    if (!!city) {
      router.push(
        `${pathName}?${CreateQueryString(searchParams, "city", city)}`
      );
    }
  }, [city, pathName]);

  return (
    <div className="w-full md:flex hidden justify-center items-center gap-4">
      <select
        name="country"
        id="country-1"
        onChange={(e) =>
          setCountry(getCountryByCode(e.target.value)?.isoCode || "")
        }
        className="w-48 border rounded-md px-2 py-1 focus:outline-none text-sm"
      >
        <option value="">Country</option>
        {countries.map((coun, index) => {
          return (
            <option key={index} value={coun.isoCode}>
              {coun.name}
            </option>
          );
        })}
      </select>
      <select
        name="state"
        id="state-1"
        value={state}
        onChange={(e) =>
          setState(getStateByCode(country, e.target.value)?.isoCode || "")
        }
        className="w-48 border rounded-md px-2 py-1 focus:outline-none text-sm"
      >
        <option value="">State</option>
        {states?.map((state, index) => {
          return (
            <option key={index} value={state.isoCode}>
              {state.name}
            </option>
          );
        })}
      </select>
      <select
        name="city"
        id="city-1"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-48 border rounded-md px-2 py-1 focus:outline-none text-sm"
      >
        <option value="">City</option>
        {cities?.map((city, index) => {
          return (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          );
        })}
      </select>
      <button
        onClick={() => router.push(`${pathName}`)}
        className="bg-slate-800 rounded-md py-2 px-4 text-slate-50 text-xs font-bold hover:bg-slate-950"
      >
        Clear filter
      </button>
    </div>
  );
}
