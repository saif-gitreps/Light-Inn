import { HotelType } from "../../../backend/src/shared/types";

export const fetchMyBookings = async (): Promise<HotelType[]> => {
   const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch bookings");
   }

   return response.json();
};

export const deleteBooking = async (
   bookingId: string,
   hotelId: string
): Promise<void> => {
   const response = await fetch(
      `${API_BASE_URL}/api/hotels/${hotelId}/bookings/${bookingId}`,
      {
         method: "DELETE",
         credentials: "include",
      }
   );

   if (!response.ok) {
      throw new Error("Failed to delete booking");
   }
};
