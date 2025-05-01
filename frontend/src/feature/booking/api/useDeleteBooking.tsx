import API_BASE_URL from "../../../config/base-url";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../../../contexts/AppContext";

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

   return response.json();
};

export const useDeleteBooking = () => {
   const queryClient = useQueryClient();
   const { showToast } = useAppContext();

   return useMutation(
      ({ bookingId, hotelId }: { bookingId: string; hotelId: string }) =>
         deleteBooking(bookingId, hotelId),
      {
         onSuccess: () => {
            showToast({ message: "Booking cancelled successfully!", type: "SUCCESS" });
            queryClient.invalidateQueries("myBookings");
         },
         onError: () => {
            showToast({
               message: "Something went wrong while cancelling",
               type: "ERROR",
            });
         },
      }
   );
};
