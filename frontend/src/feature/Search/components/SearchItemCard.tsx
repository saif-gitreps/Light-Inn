import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { HotelType } from "../../../../../backend/src/shared/types";

export default function SearchItemCard({ hotel }: { hotel: HotelType }) {
   return (
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
         <div className="w-full h-[300px] hover:opacity-90">
            <Link to={`/detail/${hotel._id}`}>
               <img
                  src={hotel.imageUrls[0]}
                  className="w-full h-full object-cover object-center"
               />
            </Link>
         </div>

         <div className="grid grid-rows-[1fr_2fr_1fr]">
            <div>
               <div className="flex items-center">
                  <span className="flex">
                     {Array.from({ length: hotel.rating }).map((_, index) => (
                        <Star key={index} className="fill-yellow-400" />
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
               <div className="sm:line-clamp-4">{hotel.description}</div>
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 items-end whitespace-nowrap">
               <div className="flex flex-wrap gap-1 items-center">
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

export function SearchItemCardSkeleton() {
   return (
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8 animate-pulse">
         <div className="w-full h-[300px] bg-gray-300 rounded"></div>
         <div className="grid grid-rows-[1fr_2fr_1fr] gap-4">
            <div className="space-y-2">
               <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
               <div className="h-8 w-2/3 bg-gray-300 rounded"></div>
            </div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-2 gap-4 items-end">
               <div className="h-8 bg-gray-300 rounded"></div>
               <div className="h-10 w-1/3 bg-gray-300 rounded self-end"></div>
            </div>
         </div>
      </div>
   );
}
