import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiServices from "./../api-services";
import { Star } from "lucide-react";

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
         <div>
            <span className="flex ">
               {Array.from({ length: hotel.rating }).map(() => (
                  <Star className="fill-yellow-400" />
               ))}
            </span>
         </div>
      </div>
   );
}

export default Detail;
