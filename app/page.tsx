import { getHotels } from "@/components/GetHotels";
import HotelList from "@/components/HotelList";
import Pagination from "@/components/Pagination";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams: { search, country, city, state, page },
}: {
  searchParams: {
    search?: string;
    country?: string;
    city?: string;
    state?: string;
    page?: string;
  };
}) {
  const { hotels, count } = await getHotels(
    parseInt(page || "1"),
    search,
    country,
    city,
    state
  );
  if (!hotels) return redirect("/404");
  if (!!hotels && hotels.length === 0) {
    return (
      <section className="w-full flex items-start ">
        <div className="text-base font-semibold text-gray-700 text-center w-full flex justify-center items-center flex-1">
          No hotel provided
        </div>
      </section>
    );
  }

  return (
    <section className="w-full  flex flex-col  flex-1">
      <HotelList hotels={hotels} />
      <Pagination count={count} />
    </section>
  );
}
