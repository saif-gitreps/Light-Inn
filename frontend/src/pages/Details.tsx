import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiServices from "./../api-services";
import { Star } from "lucide-react";
import BookHotelForm from "../forms/BookHotelForm";

function Detail() {
   const { id } = useParams();

   const { data: hotel, isLoading } = useQuery(
      ["fetchHotelById", id],
      () => apiServices.fetchHotelById(id as string),
      {
         enabled: !!id,
      }
   );

   if (!hotel || isLoading) {
      return <div className="text-center">loading..</div>;
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between">
            <h1 className="text-3xl font-bold">{hotel.name}</h1>

            <span className="flex ">
               {Array.from({ length: hotel.rating }).map(() => (
                  <Star className="fill-yellow-400" />
               ))}
            </span>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {hotel.imageUrls.map((image) => (
               <div className="h-[300px]">
                  <img
                     src={image}
                     alt={hotel.name}
                     className="rounded-md w-full h-full object-cover object-center"
                  />
               </div>
            ))}
         </div>

         <div>
            <h2 className="text-xl font-semibold mb-3">Facilities for this property:</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
               {hotel.facilities.map((facility) => (
                  <div className="border p-2 rounded text-center bg-gray-100 font-semibold">
                     {facility}
                  </div>
               ))}
            </div>
         </div>

         <div className="grid grid-cols1 lg:grid-cols-[2fr_1fr]">
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="h-fit ">
               <BookHotelForm hotelId={hotel._id} pricePerNight={hotel.pricePerNight} />
            </div>
         </div>
      </div>
   );
}

export default Detail;
