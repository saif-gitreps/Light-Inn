import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { PaymentIntentResponse } from "../../../../../backend/src/shared/types";

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

export const useCreatePaymentIntent = (hotelId: string, numberOfNights: number) => {
   return useQuery(
      "paymentIntent",
      () => createPaymentIntent(hotelId as string, numberOfNights.toString()),
      {
         enabled: !!hotelId && numberOfNights > 0,
      }
   );
};
