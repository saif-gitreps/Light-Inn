import { HotelSearchResponse } from "../../../../../backend/src/shared/types";
import API_BASE_URL from "../../../config/base-url";

export type SearchParams = {
   destination: string;
   checkIn: string;
   checkOut: string;
   adultCount?: number;
   childCount?: number;
   page?: string;
   facilities?: string[];
   types?: string[];
   stars?: string | string[];
   maxPrice?: string;
   sortOption?: string;
};

export const searchHotels = async (
   searchParams: SearchParams | null
): Promise<HotelSearchResponse> => {
   const queryParam = new URLSearchParams();

   if (searchParams) {
      queryParam.append("destination", searchParams.destination || "");
      queryParam.append("checkIn", searchParams.checkIn || "");
      queryParam.append("checkOut", searchParams.checkOut || "");
      queryParam.append("adultCount", searchParams.adultCount?.toString() || "");
      queryParam.append("childCount", searchParams.childCount?.toString() || "");
      queryParam.append("page", searchParams.page || "");

      queryParam.append("maxPrice", searchParams.maxPrice || "");
      queryParam.append("sortOption", searchParams.sortOption || "");

      searchParams.facilities?.forEach((facility) =>
         queryParam.append("facilities", facility)
      );

      searchParams.types?.forEach((type) => queryParam.append("types", type));

      if (typeof searchParams.stars === "string") {
         queryParam.append("stars", searchParams.stars);
      } else if (Array.isArray(searchParams.stars)) {
         searchParams.stars.forEach((star) => queryParam.append("stars", star));
      }
   }

   const response = await fetch(
      `${API_BASE_URL}/api/hotels/search?${queryParam.toString()}`
   );

   if (!response.ok) {
      throw new Error("Failed to fetch hotels");
   }

   return response.json();
};
