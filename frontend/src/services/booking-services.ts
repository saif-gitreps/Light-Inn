import { HotelType, PaymentIntentResponse } from "../../../backend/src/shared/types";
import { BookingFormData } from "../forms/BookingForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const createPaymentIntent = async (
   id: string,
   numberOfNights: string
): Promise<PaymentIntentResponse> => {
   const response = await fetch(
      `${API_BASE_URL}/api/hotels/${id}/bookings/payment-intent`,
      {
         credentials: "include",
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ numberOfNights }),
      }
   );

   if (!response.ok) {
      throw new Error("Failed to create payment intent");
   }

   return response.json();
};

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
