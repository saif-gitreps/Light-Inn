import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../contexts/SearchContext";
import { Button } from "../components/ui/button";
import { useAppContext } from "../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type BookHotelFormProps = {
   hotelId: string;
   pricePerNight: number;
};

type BookHotelFormData = {
   checkIn: Date;
   checkOut: Date;
   adultCount: number;
   childCount: number;
};

function BookHotelForm({ hotelId, pricePerNight }: BookHotelFormProps) {
   const navigate = useNavigate();
   const search = useSearchContext();
   const { isAuth } = useAppContext();
   const location = useLocation();
   const {
      watch,
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm<BookHotelFormData>({
      defaultValues: {
         checkIn: search.checkIn,
         checkOut: search.checkOut,
         adultCount: search.adultCount,
         childCount: search.childCount,
      },
   });
   const checkIn = watch("checkIn");
   const checkOut = watch("checkOut");
   const maxDate = new Date();
   maxDate.setFullYear(maxDate.getFullYear() + 1);

   const onUnauthSubmit = (data: BookHotelFormData) => {
      search.saveSearchValues(
         "",
         data.checkIn,
         data.checkOut,
         data.adultCount,
         data.childCount
      );

      navigate("/sign-in", { state: { from: location } });
   };

   const onSubmit = (data: BookHotelFormData) => {
      search.saveSearchValues(
         "",
         data.checkIn,
         data.checkOut,
         data.adultCount,
         data.childCount
      );

      navigate(`/hotel/${hotelId}/booking`, { state: { from: location } });
   };

   return (
      <div className="flex flex-col p-4 bg-gray-100 shadow-sm rounded gap-4">
         <h3 className="text-md text-xl font-semibold"> Book now! </h3>

         <form onSubmit={isAuth ? handleSubmit(onSubmit) : handleSubmit(onUnauthSubmit)}>
            <div className="grid grid-cols-1 gap-2 items-center">
               <label htmlFor="checkIn">Check in date:</label>
               <DatePicker
                  id="checkIn"
                  selected={checkIn}
                  onChange={(date) => setValue("checkIn", date as Date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  maxDate={maxDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Check-in Date"
                  className="min-w-full bg-white p-2 focus:outline-none border rounded"
                  wrapperClassName="min-w-full"
               />

               <label htmlFor="checkOut">Check out date:</label>
               <DatePicker
                  id="checkOut"
                  selected={checkOut}
                  onChange={(date) => setValue("checkIn", date as Date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  maxDate={maxDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Check-in Date"
                  className="min-w-full bg-white p-2 focus:outline-none border rounded"
                  wrapperClassName="min-w-full"
               />
               <div className="flex bg-white px-2 py-1 gap-4 border rounded">
                  <label className="items-center flex">
                     Adults:
                     <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={1}
                        max={20}
                        {...register("adultCount", {
                           required: "Adult count is required",
                           min: {
                              value: 1,
                              message: "One adult minimum",
                           },
                           valueAsNumber: true,
                        })}
                     />
                  </label>
                  {errors.adultCount && (
                     <span className="text-red-600">{errors.adultCount.message}</span>
                  )}

                  <label className="items-center flex">
                     Child:
                     <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={0}
                        max={20}
                        {...register("childCount", {
                           valueAsNumber: true,
                        })}
                     />
                  </label>
                  {errors.childCount && (
                     <span className="text-red-600">{errors.childCount.message}</span>
                  )}
               </div>

               {isAuth ? (
                  <Button>Book for ${pricePerNight}</Button>
               ) : (
                  <Button>Sign in to book for $ {pricePerNight}</Button>
               )}
            </div>
         </form>
      </div>
   );
}

export default BookHotelForm;
