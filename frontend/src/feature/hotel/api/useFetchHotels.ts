import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { HotelType } from "../../../../../backend/src/shared/types";

export const fetchHotels = async (): Promise<HotelType[]> => {
   const response = await fetch(`${API_BASE_URL}/api/hotels`);

   if (!response.ok) {
      throw new Error("Failed to fetch hotels");
   }

   return response.json();
};

export const useFetchHotels = () => {
   return useQuery({
      queryKey: ["hotels"],
      queryFn: fetchHotels,
   });
};
