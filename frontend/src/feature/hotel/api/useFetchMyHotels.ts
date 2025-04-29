import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { HotelType } from "../../../../../backend/src/shared/types";

const fetchMyHotels = async (): Promise<HotelType[]> => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch hotels");
   }

   return response.json();
};

export const useFetchMyHotels = () => {
   return useQuery({
      queryKey: ["myhotels"],
      queryFn: fetchMyHotels,
   });
};
