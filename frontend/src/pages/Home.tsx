import { useQuery } from "react-query";
import * as apiServices from "../api-services";
import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";

function Home() {
   const { data: hotels } = useQuery("fetchQuery", () => apiServices.fetchHotels());

   const topRowHotels = hotels?.slice(0, 2) || [];
   const bottomRowHotels = hotels?.slice(2) || [];

   return (
      <div className="space-y-3">
         <h2 className="text-3xl font-bold">Latest Destinations</h2>
         <p>Most recent desinations added by our hosts</p>
         <div className="grid gap-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
               {topRowHotels.map((hotel) => (
                  <LatestDestinationCard hotel={hotel} />
               ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
               {bottomRowHotels.map((hotel) => (
                  <LatestDestinationCard hotel={hotel} />
               ))}
            </div>
         </div>
      </div>
   );
}

function LatestDestinationCard({ hotel }: { hotel: HotelType }) {
   return (
      <Link
         to={`/detail/${hotel._id}`}
         className="relative cursor-pointer overflow-hidden rounded-md"
      >
         <div className="h-[300px]">
            <img
               src={hotel.imageUrls[0]}
               className="w-full h-full object-cover object-center"
            />
         </div>

         <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
            <span className="text-white font-bold tracking-tight text-3xl">
               {hotel.name}
            </span>
         </div>
      </Link>
   );
}

export default Home;
