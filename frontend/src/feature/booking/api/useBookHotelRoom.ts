import { useMutation, useQueryClient } from "react-query";
import { BookingFormData } from "../../../lib/shared-types";
import API_BASE_URL from "../../../config/base-url";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";

export const bookHotelRoom = async (formData: BookingFormData) => {
   const response = await fetch(
      `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify(formData),
      }
   );

   if (!response.ok) {
      throw new Error("Failed to book hotel room");
   }

   return response.json();
};

export const useBookHotelRoom = () => {
   const { showToast } = useAppContext();
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   return useMutation(bookHotelRoom, {
      onSuccess: () => {
         showToast({ message: "Hotel booked successfully!", type: "SUCCESS" });
         queryClient.invalidateQueries("myBookings");
         navigate("/booked-rooms");
      },
      onError: () => {
         showToast({ message: "Something went wrong while booking", type: "ERROR" });
      },
   });
};
