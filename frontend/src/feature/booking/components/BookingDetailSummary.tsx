import { HotelType } from "../../../../../backend/src/shared/types";

type BookingDetailSummaryProps = {
   checkIn: Date;
   checkOut: Date;
   adultCount: number;
   childCount: number;
   numberOfNights: number;
   hotel: HotelType;
};

export default function BookingDetailSummary({
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
