import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { HotelType } from "../../../../../backend/src/shared/types";

export const fetchHotelById = async (id: string): Promise<HotelType> => {
   const response = await fetch(`${API_BASE_URL}/api/hotels/${id}`);

   if (!response.ok) {
      throw new Error("Error fetching hotels");
   }

   return response.json();
};

export const useFetchHotelById = (hotelId: string) => {
   return useQuery({
      queryKey: ["hotel", hotelId],
      queryFn: () => fetchHotelById(hotelId),
      enabled: !!hotelId,
   });
};
