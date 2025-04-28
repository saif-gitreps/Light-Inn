import { useQuery } from "react-query";
import { HotelType } from "../../../../../backend/src/shared/types";
import API_BASE_URL from "../../../config/base-url";

export const fetchMyHotelById = async (id: string): Promise<HotelType> => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels/${id}`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch hotel");
   }

   return response.json();
};

export const useFetchMyHotelById = (hotelId: string) => {
   return useQuery({
      queryKey: ["hotel", hotelId],
      queryFn: () => fetchMyHotelById(hotelId),
      enabled: !!hotelId,
   });
};
