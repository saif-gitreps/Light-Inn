import * as hotelServices from "../services/hotel-services";
import * as bookingServices from "../services/booking-services";
import * as authServices from "../services/auth-services";
import { useQuery } from "react-query";
import BookingForm from "../forms/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HotelType } from "../../../backend/src/shared/types";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

function Booking() {
   const search = useSearchContext();
   const { stripePromise } = useAppContext();
   const { id } = useParams();

   const { data: hotel, isLoading: isHotelLoading } = useQuery(
      "fetchHotelById",
      () => hotelServices.fetchHotelById(id as string),
      {
         enabled: !!id,
      }
   );
   const { data: currentUser, isLoading: isUserLoading } = useQuery(
      "currentUser",
      authServices.fetchCurrentUser
   );

   const [numberOfNights, setNumberOfNights] = useState<number>(0);

   useEffect(() => {
      if (search.checkIn && search.checkOut) {
         const nights =
            Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
            (1000 * 60 * 60 * 24);

         setNumberOfNights(Math.ceil(nights));
      }
   }, [search.checkIn, search.checkOut]);

   const { data: paymentIntent, isLoading: isPaymentLoading } = useQuery(
      "createPaymentIntent",
      () => bookingServices.createPaymentIntent(id as string, numberOfNights.toString()),
      {
         enabled: !!id && numberOfNights > 0,
      }
   );

   const isLoading = isHotelLoading || isUserLoading || isPaymentLoading;

   if (isLoading) {
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
               <BookingForm currentUser={currentUser} paymentIntent={paymentIntent} />
            </Elements>
         )}
      </div>
   );
}

type BookingDetailSummaryProps = {
   checkIn: Date;
   checkOut: Date;
   adultCount: number;
   childCount: number;
   numberOfNights: number;
   hotel: HotelType;
};

function BookingDetailSummary({
   checkIn,
   checkOut,
   adultCount,
   childCount,
   numberOfNights,
   hotel,
}: BookingDetailSummaryProps) {
   return (
      <div className="grid gap-4 rounded border p-5 h-fit">
         <h2 className="text-xl font-bold">Your booking details</h2>
         <div className="border-b py-2">
            Location:
            <div className="font-bold">
               {` ${hotel.name}, ${hotel.city}, ${hotel?.country}`}
            </div>
         </div>
         <div className="flex justify-between">
            <div>
               Check In:
               <div className="font-bold">{checkIn.toDateString()}</div>
            </div>
            <div>
               Check Out:
               <div className="font-bold">{checkOut.toDateString()}</div>
            </div>
         </div>

         <div className="border-t border-b py-2 ">
            Number of nights staying:
            <div className="font-bold">{numberOfNights} nights</div>
         </div>

         <div className="border-t border-b py-2 ">
            Guests:
            <div className="font-bold">
               {adultCount} adults <span className="font-normal">and</span> {childCount}{" "}
               children
            </div>
         </div>
      </div>
   );
}

export default Booking;
