import { useSearchContext } from "../feature/Search/contexts/SearchContext";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { Button } from "../components/ui/button";
import Pagination from "../components/Pagination";
import { Popover, PopoverTrigger } from "../components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { useSearchHotels } from "../feature/Search/api/useSearchHotels";
import SearchItemCard, {
   SearchItemCardSkeleton,
} from "../feature/Search/components/SearchItemCard";
import {
   FacilitiesFilter,
   HotelTypesFilter,
   PriceFilter,
   StarRatingFilter,
} from "../feature/Search/components/filter-components";

function SearchResult() {
   const location = useLocation();
   const queryParam = new URLSearchParams(location.search);
   const [isAll, setIsAll] = useState<boolean>(queryParam.get("all") === "true");
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

   const { data: hotelData, isLoading } = useSearchHotels(isAll, setIsAll, searchParams);

   const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const starRating = event.target.value;

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
         <Popover>
            <PopoverTrigger className="lg:hidden" asChild>
               <Button variant="outline">
                  Filter <Settings2 />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="lg:hidden">
               <div className="rounded border z-50 bg-white shadow-lg p-3">
                  <h3 className="text-lg font-semibold border-b pb-5">Filter by:</h3>
                  <div className="p-3 grid grid-cols-2 sm:grid-cols-3">
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
            </PopoverContent>
         </Popover>

         <div className="hidden lg:block rounded border p-5 lg:h-fit lg:sticky lg:top-10">
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

         <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
               <span className="text-xl font-bold">
                  {isLoading
                     ? "Loading hotels..."
                     : `${hotelData?.data.length} Hotels found`}
                  {search.destination && !isLoading ? ` in ${search.destination}` : ""}
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

            {isLoading
               ? Array.from({ length: 3 }).map((_, index) => (
                    <SearchItemCardSkeleton key={index} />
                 ))
               : hotelData?.data.map((hotel) => (
                    <SearchItemCard key={hotel._id} hotel={hotel} />
                 ))}

            {!isLoading && (
               <div>
                  <Pagination
                     page={hotelData?.pagination.page || 1}
                     pages={hotelData?.pagination.pages || 1}
                     onPageChange={(page) => setPage(page)}
                  />
               </div>
            )}
         </div>
      </div>
   );
}

export default SearchResult;
