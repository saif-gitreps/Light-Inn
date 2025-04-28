import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import LatestDestinationCard from "../feature/hotel/components/LatestDestinationCard";
import { useFetchHotels } from "../feature/hotel/api/useFetchHotels";

function Home() {
   const { data: hotels, isLoading } = useFetchHotels();

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

export default Home;
