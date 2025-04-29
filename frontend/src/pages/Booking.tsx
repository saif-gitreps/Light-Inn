import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";
import { useFetchHotelById } from "../feature/hotel/api/useFetchHotelById";
import { useCreatePaymentIntent } from "../feature/booking/api/useCreatePaymentIntent";
import BookingDetailSummary from "../feature/booking/components/BookingDetailSummary";
import ConfirmHotelBookingForm from "../feature/booking/components/ConfirmHotelBookingForm";

function Booking() {
   const search = useSearchContext();
   const { stripePromise } = useAppContext();
   const { currentUser } = useAppContext();
   const { id } = useParams();

   const { data: hotel, isLoading: isHotelLoading } = useFetchHotelById(id as string);

   const [numberOfNights, setNumberOfNights] = useState<number>(0);

   useEffect(() => {
      if (search.checkIn && search.checkOut) {
         const nights =
            Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
            (1000 * 60 * 60 * 24);

         setNumberOfNights(Math.ceil(nights));
      }
   }, [search.checkIn, search.checkOut]);

   const { data: paymentIntent, isLoading: isPaymentLoading } = useCreatePaymentIntent(
      id as string,
      numberOfNights
   );

   const isLoading = isHotelLoading || isPaymentLoading;

   if (isLoading) {
      return BookingSkeleton();
   }

   return (
      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
         {hotel && (
            <BookingDetailSummary
               checkIn={search.checkIn}
               checkOut={search.checkOut}
               adultCount={search.adultCount}
               childCount={search.childCount}
               numberOfNights={numberOfNights}
               hotel={hotel}
            />
         )}

         {currentUser && !paymentIntent && (
            <div className="grid gap-4 rounded border p-5 h-fit">
               <h2 className="text-xl font-bold">Apologies.</h2>
               <div className="text-red-600">
                  There was an error processing your payment. Please try again later.
               </div>
            </div>
         )}

         {currentUser && paymentIntent && (
            <Elements
               stripe={stripePromise}
               options={{
                  clientSecret: paymentIntent.clientSecret,
               }}
            >
               <ConfirmHotelBookingForm
                  currentUser={currentUser}
                  paymentIntent={paymentIntent}
               />
            </Elements>
         )}
      </div>
   );
}

function BookingSkeleton() {
   return (
      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
         <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
            <div className="h-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
         </div>

         <div className="h-80 bg-slate-200 rounded animate-pulse"></div>
      </div>
   );
}

export default Booking;
