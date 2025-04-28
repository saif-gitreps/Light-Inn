import { Link } from "react-router-dom";
import { HotelType } from "../../../../../backend/src/shared/types";

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

export default LatestDestinationCard;
