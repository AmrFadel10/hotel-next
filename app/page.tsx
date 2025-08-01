import { getHotels } from "@/components/GetHotels";
import HotelList from "@/components/HotelList";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams: { search, country, city, state },
}: {
  searchParams: {
    search?: string;
    country?: string;
    city?: string;
    state?: string;
  };
}) {
  const hotels = await getHotels(search, country, city, state);
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
    <section className="w-full flex items-start ">
      <HotelList hotels={hotels} />
    </section>
  );
}
