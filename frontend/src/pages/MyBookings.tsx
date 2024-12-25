import { useMutation, useQuery, useQueryClient } from "react-query";
import * as bookingServices from "../services/booking-services";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAppContext } from "../contexts/AppContext";

function MyBookings() {
   const queryClient = useQueryClient();
   const { showToast } = useAppContext();
   const { data: hotels, isLoading } = useQuery(
      "myBookings",
      bookingServices.fetchMyBookings
   );

   const { mutate: deleteBooking, isLoading: isDeleteLoading } = useMutation(
      ({ bookingId, hotelId }: { bookingId: string; hotelId: string }) =>
         bookingServices.deleteBooking(bookingId, hotelId),
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

   if (isLoading) {
      return <MyBookingCardSkeleton />;
   }

   if (!hotels || hotels?.length === 0) {
      return (
         <h1 className="text-center font-semibold">
            No bookings yet.{" "}
            <Link className="underline text-blue-700" to="/search?q=All">
               Browse hotels
            </Link>
         </h1>
      );
   }

   return (
      <div className="space-y-5">
         <h1 className="text-3xl font-bold">My Bookings</h1>
         {hotels.map((hotel) => (
            <div
               key={hotel._id}
               className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5"
            >
               <div className="lg:w-full lg:h-[250px]">
                  <img
                     src={hotel.imageUrls[0]}
                     className="w-full h-full object-cover object-center"
                  />
               </div>
               <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                  <div className="text-2xl font-bold">
                     <Link to={`/detail/${hotel._id}`}>{hotel.name}</Link>
                     <div className="text-xs font-normal">
                        {hotel.city}, {hotel.country}
                     </div>
                  </div>
                  {hotel.bookings.map((booking) => (
                     <div key={booking._id} className="flex justify-between">
                        <div>
                           <div>
                              <span className="font-bold mr-2">Dates: </span>
                              <span>
                                 {new Date(booking.checkIn).toDateString()} -
                                 {new Date(booking.checkOut).toDateString()}
                              </span>
                           </div>
                           <div>
                              <span className="font-bold mr-2">Guests:</span>
                              <span>
                                 {booking.adultCount} adults, {booking.childCount}{" "}
                                 children
                              </span>
                           </div>
                        </div>

                        <Button
                           variant="destructive"
                           onClick={() =>
                              deleteBooking({
                                 bookingId: booking._id,
                                 hotelId: hotel._id,
                              })
                           }
                           disabled={isDeleteLoading}
                        >
                           Cancel
                        </Button>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
}

function MyBookingCardSkeleton() {
   return (
      <div className="space-y-5">
         <h1 className="text-3xl font-bold">My Bookings</h1>
         {[1, 2, 3].map((index) => (
            <div
               key={index}
               className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5 animate-pulse"
            >
               <div className="lg:w-full lg:h-[250px] bg-slate-200 rounded"></div>
               <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  {[1, 2].map((i) => (
                     <div key={i} className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
}

export default MyBookings;
