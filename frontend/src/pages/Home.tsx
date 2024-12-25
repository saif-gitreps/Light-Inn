import { useQuery } from "react-query";
import * as hotelServices from "../services/hotel-services";
import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

function Home() {
   const { data: hotels, isLoading } = useQuery("fetchHotels", () =>
      hotelServices.fetchHotels()
   );

   return (
      <div className="space-y-8 px-4">
         <Hero />
         <section className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-extrabold text-gray-800">
                  Latest Destinations
               </h2>
               <p className="text-gray-600 text-sm">
                  Most recent destinations added by our hosts
               </p>
            </div>

            <Button asChild variant="link">
               <Link to="/search?q=All">
                  View all <ArrowRight />
               </Link>
            </Button>
         </section>

         {isLoading ? (
            <SkeletonLoader />
         ) : (
            <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
               {hotels?.map((hotel) => (
                  <LatestDestinationCard hotel={hotel} key={hotel._id} />
               ))}
            </div>
         )}
      </div>
   );
}

function SkeletonLoader() {
   return (
      <div className="space-y-4 px-4">
         <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-[300px] bg-gray-300 rounded-md"></div>
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
         className="group relative cursor-pointer overflow-hidden rounded-md shadow-lg hover:scale-105 transition-transform"
      >
         <div className="h-[300px]">
            <img
               src={hotel.imageUrls[0]}
               alt={hotel.name}
               className="w-full h-full object-cover object-center group-hover:opacity-90"
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-50"></div>
         <div className="absolute bottom-4 left-4">
            <h3 className="text-white font-bold text-lg">{hotel.name}</h3>
            <span className="text-gray-300 text-sm">${hotel.pricePerNight}/night</span>
         </div>
      </Link>
   );
}

export default Home;
