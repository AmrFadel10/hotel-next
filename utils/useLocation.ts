import { Country, State, City } from "country-state-city";

const useLocations = () => {
  const getCountryByCode = (countryCode: string) => {
    const country = Country.getAllCountries().find(
      (country) => country.isoCode === countryCode
    );
    if (!country) return null;

    return country;
  };

  const getStateByCode = (countryCode: string, stateCode: string) => {
    const state = State.getAllStates().find(
      (state) =>
        state.countryCode === countryCode && state.isoCode === stateCode
    );
    if (!state) return null;
    return state;
  };

  const getCountryStates = (countryCode: string) => {
    return State.getAllStates().filter((state) => {
      return state.countryCode === countryCode;
    });
  };

  const getStateCities = (stateCode: string, countryCode: string) => {
    return City.getAllCities().filter(
      (city) => city.stateCode === stateCode && city.countryCode === countryCode
    );
  };
  return {
    getStateByCode,
    getCountryByCode,
    getCountryStates,
    getStateCities,
    getCountries: Country.getAllCountries,
  };
};

export default useLocations;
