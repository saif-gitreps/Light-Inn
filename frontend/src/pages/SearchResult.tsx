import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiService from "../api-services";
import { useState } from "react";
import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "../components/ui/button";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/filter-components/StarRatingFilter";
import HotelTypesFilter from "../components/filter-components/HotelTypeFilter";
import FacilitiesFilter from "../components/filter-components/FacilitiesFilter";
import PriceFilter from "../components/filter-components/PriceFilter";

function SearchResult() {
   const search = useSearchContext();
   const [page, setPage] = useState(1);
   const [selectedStars, setSelectedStars] = useState<string[]>([]);
   const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
   const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
   const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined);
   const [sortOption, setSortOption] = useState<string>("");

   const searchParams = {
      destination: search.destination,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      adultCount: search.adultCount,
      childCount: search.childCount,
      page: page.toString(),
      stars: selectedStars,
      types: selectedHotelTypes,
      facilities: selectedFacilities,
      maxPrice: selectedPrice?.toString(),
      sortOption,
   };

   const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
      apiService.searchHotels(searchParams)
   );

   const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const starRating = event.target.value;

      // checking and unchecking operation
      setSelectedStars((prev) =>
         event.target.checked
            ? [...prev, starRating]
            : prev.filter((star) => star !== starRating)
      );
   };

   const handleHotelTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const hotelType = event.target.value;

      setSelectedHotelTypes((prev) =>
         event.target.checked
            ? [...prev, hotelType]
            : prev.filter((prevHotelType) => prevHotelType !== hotelType)
      );
   };

   const handleFacilitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const facility = event.target.value;

      setSelectedFacilities((prev) =>
         event.target.checked
            ? [...prev, facility]
            : prev.filter((prevFacility) => prevFacility !== facility)
      );
   };

   return (
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
         <div className="rounded border p-5 h-fit sticky top-10">
            <div className="space-y-5">
               <h3 className="text-lg font-semibold border-b pb-5">Filter by:</h3>

               <StarRatingFilter
                  selectedStars={selectedStars}
                  onChange={handleStarsChange}
               />

               <HotelTypesFilter
                  selectedHotelTypes={selectedHotelTypes}
                  onChange={handleHotelTypesChange}
               />

               <FacilitiesFilter
                  selectedFacilities={selectedFacilities}
                  onChange={handleFacilitiesChange}
               />

               <PriceFilter
                  selectedPrice={selectedPrice}
                  onChange={(value?: number) => setSelectedPrice(value)}
               />
            </div>
         </div>

         <div className="flex flex-col gap-5 ">
            <div className="flex justify-between items-center">
               <span className="text-xl font-bold">
                  {hotelData?.pagination.total} Hotels found
                  {search.destination ? ` in ${search.destination}` : ""}
               </span>

               <select
                  className="p-2 border rounded"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
               >
                  <option value="">Sort by</option>
                  <option value="rating">Star rating</option>
                  <option value="pricePerNightAsc">Price per night (low to high)</option>
                  <option value="pricePerNightDesc">Price per night (high to low)</option>
               </select>
            </div>

            {hotelData?.data.map((hotel) => (
               <SearchItemCard key={hotel._id} hotel={hotel} />
            ))}

            <div>
               <Pagination
                  page={hotelData?.pagination.page || 1}
                  pages={hotelData?.pagination.pages || 1}
                  onPageChange={(page) => setPage(page)}
               />
            </div>
         </div>
      </div>
   );
}

function SearchItemCard({ hotel }: { hotel: HotelType }) {
   return (
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
         <div className="w-full h-[300px]">
            <img
               src={hotel.imageUrls[0]}
               className="w-full h-full object-cover object-center"
            />
         </div>
         <div className="grid grid-rows-[1fr_2fr_1fr]">
            <div>
               <div className="flex items-center">
                  <span className="flex">
                     {Array.from({ length: hotel.rating }).map(() => (
                        <Star className="fill-yellow-400" />
                     ))}
                  </span>

                  <span className="ml-1 text-sm font-bold">{hotel.type}</span>
               </div>

               <Link
                  to={`/detail/${hotel._id}`}
                  className="text-2xl font-bold cursor-pointer hover:opacity-80"
               >
                  {hotel.name}
               </Link>
            </div>

            <div>
               <div className="line-clamp-4">{hotel.description}</div>
            </div>

            <div className="grid grid-cols-2 items-end whitespace-nowrap">
               <div className="flex gap-1 items-center">
                  {hotel.facilities.slice(0, 3).map((facility) => (
                     <span
                        key={facility}
                        className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap"
                     >
                        {facility}
                     </span>
                  ))}

                  <span className="text-sm">
                     {hotel.facilities.length > 3 &&
                        `+${hotel.facilities.length - 3} more`}
                  </span>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <span className="font-bold">${hotel.pricePerNight} per night</span>

                  <Button size="lg">
                     <Link to={`/detail/${hotel._id}`}>Check details</Link>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default SearchResult;
