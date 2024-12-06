import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, House, MapPin, PersonStanding, Plus, Star } from "lucide-react";
import { useQuery } from "react-query";
import * as apiServices from "../api-services";

function MyHotels() {
   const { data: myHotelsData, isLoading } = useQuery(
      "fetchMyHotels",
      apiServices.fetchMyHotels
   );

   if (!myHotelsData) {
      return <div className="text-center">No hotels found.</div>;
   }

   if (isLoading) {
      return <div className="text-center">Loading...</div>;
   }

   // TODO: Add a loader here

   return (
      <div className="space-y-5">
         <div className="flex justify-between">
            <h1 className="text-3xl font-bold">My listed hotels</h1>

            <Button asChild variant="outline">
               <Link to="/add-hotel">
                  New <Plus className="ml-1 stroke-black" />
               </Link>
            </Button>
         </div>

         <div className="grid grid-col-1 gap-8">
            {myHotelsData?.map((hotel) => (
               <div key={hotel._id} className="border shadow-sm rounded p-5 space">
                  <h2 className="flex justify-between items-center text-xl font-semibold">
                     {hotel.name}

                     <Button asChild variant="outline">
                        <Link to={`/edit-hotel/${hotel._id}`}>View and edit</Link>
                     </Button>
                  </h2>
                  <div className="whitespace-pre-line text-lg">{hotel.description}</div>
                  <div className="grid grid-cols-3 md:grid-cols-5">
                     <div className="border rounded p-3 flex items-center">
                        <MapPin className="mr-2 stroke-red-600" /> {hotel.city},{" "}
                        {hotel.country}
                     </div>

                     <div className="border rounded p-3 flex items-center">
                        <House className="mr-2 stroke-blue-700" />
                        {hotel.type}
                     </div>

                     <div className="border rounded p-3 flex items-center">
                        <DollarSign className="stroke-green-600" /> {hotel.pricePerNight}{" "}
                        <span className="italic ml-1">per night</span>
                     </div>

                     <div className="border rounded p-3 flex items-center">
                        <Star className="mr-2 stroke-yellow-600" /> {hotel.rating} star
                        {hotel.rating > 1 && "s"}
                     </div>

                     <div className="border rounded p-3 flex items-center">
                        <PersonStanding className="mr-2 stroke-violet-950" />{" "}
                        {hotel.adultCount} adults, {hotel.childCount} children
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default MyHotels;
