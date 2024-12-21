import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiServices from "../api-services";
import { Button } from "../components/ui/button";
import { useAppContext } from "../contexts/AppContext";

type BookingFormProps = {
   currentUser: UserType;
   paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
   firstName: string;
   lastName: string;
   email: string;
   adultCount: number;
   childCount: number;
   checkIn: string;
   checkOut: string;
   hotelId: string;
   paymentIntentId: string;
   totalCost: number;
};

function BookingForm({ currentUser, paymentIntent }: BookingFormProps) {
   const stripe = useStripe();
   const elements = useElements();
   const search = useSearchContext();
   const { id } = useParams();
   const { showToast } = useAppContext();

   const { handleSubmit, register } = useForm<BookingFormData>({
      defaultValues: {
         firstName: currentUser.firstName,
         lastName: currentUser.lastName,
         email: currentUser.email,
         adultCount: search.adultCount,
         childCount: search.childCount,
         checkIn: search.checkIn.toISOString(),
         checkOut: search.checkOut.toISOString(),
         hotelId: id as string,
         paymentIntentId: paymentIntent.paymentIntentId,
         totalCost: paymentIntent.totalCost,
      },
   });

   const { mutate: bookHotelRoom, isLoading } = useMutation(apiServices.bookHotelRoom, {
      onSuccess: () => {
         showToast({ message: "Hotel booked successfully!", type: "SUCCESS" });
      },
      onError: () => {
         showToast({ message: "Something went wrong while booking", type: "ERROR" });
      },
   });

   const onSubmit = async (formData: BookingFormData) => {
      if (!stripe || !elements) {
         return;
      }

      const results = await stripe?.confirmCardPayment(paymentIntent.clientSecret, {
         payment_method: {
            card: elements?.getElement(CardElement) as StripeCardElement,
         },
      });

      if (results.paymentIntent?.status === "succeeded") {
         bookHotelRoom({ ...formData, paymentIntentId: results.paymentIntent.id });
      }
   };

   return (
      <form
         className="grid grid-cols-1 gap-4 rounded border p-5"
         onSubmit={handleSubmit(onSubmit)}
      >
         <span className="text-2xl font-bold">Please confirm your details</span>

         <div className="grid grid-cols-2 gap-6">
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
               First Name:
               <input
                  className="mt-1 border rounded w-full py-2 px-4 text-gray-600 bg-gray-50 font-semibold"
                  type="text"
                  readOnly
                  disabled
                  {...register("firstName")}
               />
            </label>

            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
               Last Name:
               <input
                  className="mt-1 border rounded w-full py-2 px-4 text-gray-600 bg-gray-50 font-semibold"
                  type="text"
                  readOnly
                  disabled
                  {...register("lastName")}
               />
            </label>

            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
               Email:
               <input
                  className="mt-1 border rounded w-full py-2 px-4 text-gray-600 bg-gray-50 font-semibold"
                  type="text"
                  readOnly
                  disabled
                  {...register("email")}
               />
            </label>
         </div>

         <div className="space-y-2">
            <h2 className="text-xl font-semibold">Price details</h2>

            <div className="bg-gray-200 p-4 rounded">
               <div className="font-semibold text-lg">
                  Total cost: ${paymentIntent?.totalCost?.toFixed(2)}
               </div>
            </div>
         </div>

         <div className="space-y-2">
            <h3 className="text-xl font-semibold">Payment details</h3>

            <CardElement id="payment-element" className="border rounded p-2 text-sm" />
         </div>

         <div className="flex justify-end">
            <Button disabled={isLoading}>Confirm booking</Button>
         </div>
      </form>
   );
}

export default BookingForm;
