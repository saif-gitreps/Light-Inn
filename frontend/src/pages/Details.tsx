import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

import { useFetchHotelById } from "../feature/hotel/api/useFetchHotelById";
import BookHotelForm from "../feature/booking/components/BookHotelForm";

function Detail() {
   const { id } = useParams();
   const { data: hotel, isLoading } = useFetchHotelById(id as string);

   if (isLoading) {
      return <DetailSkeleton />;
   }

   if (!hotel) {
      return <div className="text-center">No details found for this hotel.</div>;
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between">
            <h1 className="text-3xl font-bold">{hotel.name}</h1>

            <span className="flex">
               {Array.from({ length: hotel.rating }).map((_, index) => (
                  <Star key={index} className="fill-yellow-400" />
               ))}
            </span>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {hotel.imageUrls.map((image) => (
               <div className="h-[300px]" key={image}>
                  <img
                     src={image}
                     alt={hotel.name}
                     className="rounded-md w-full h-full object-cover object-center"
                  />
               </div>
            ))}
         </div>

         <div className="whitespace-pre-line">{hotel.description}</div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
               <h2 className="text-xl font-semibold mb-3">
                  Facilities for this property:
               </h2>

               <div className="grid grid-cols-2 gap-2">
                  {hotel.facilities.map((facility) => (
                     <div
                        key={facility}
                        className="border p-1 rounded text-center bg-gray-100 font-semibold flex items-center justify-center"
                     >
                        {facility}
                     </div>
                  ))}
               </div>
            </div>
            <div className="h-fit">
               <BookHotelForm hotelId={hotel._id} pricePerNight={hotel.pricePerNight} />
            </div>
         </div>
      </div>
   );
}

function DetailSkeleton() {
   return (
      <div className="space-y-6">
         <div className="flex justify-between animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-2/3"></div>
            <div className="flex space-x-2">
               {[1, 2, 3, 4, 5].map((key) => (
                  <div key={key} className="h-6 w-6 bg-slate-200 rounded"></div>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((key) => (
               <div
                  key={key}
                  className="h-[300px] bg-slate-200 rounded-md animate-pulse"
               ></div>
            ))}
         </div>

         <div>
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
               {[1, 2, 3, 4].map((key) => (
                  <div
                     key={key}
                     className="h-10 bg-slate-200 rounded animate-pulse"
                  ></div>
               ))}
            </div>
         </div>

         <div className="grid grid-cols1 lg:grid-cols-[2fr_1fr] gap-4">
            <div className="space-y-3">
               {[1, 2, 3].map((key) => (
                  <div key={key} className="h-6 bg-slate-200 rounded animate-pulse"></div>
               ))}
            </div>
            <div className="h-32 bg-slate-200 rounded animate-pulse"></div>
         </div>
      </div>
   );
}

export default Detail;
