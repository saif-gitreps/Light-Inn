import { useQuery } from "react-query";
import { HotelType } from "../../../../../backend/src/shared/types";
import API_BASE_URL from "../../../config/base-url";

const fetchMyBookings = async (): Promise<HotelType[]> => {
   const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch bookings");
   }

   return response.json();
};

export const useFetchMyHotelBookings = () => {
   return useQuery("myBookings", fetchMyBookings);
};
