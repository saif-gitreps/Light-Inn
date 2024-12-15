import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../contexts/SearchContext";

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
   const search = useSearchContext();
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

   return (
      <div className="flex flex-col p-4 bg-blue-200 gap-4">
         <h3 className="text-md font-bold">$ {pricePerNight}</h3>

         <form action="">
            <div className="grid grid-cols-1 gap-4 items-center">
               <DatePicker
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
            </div>

            <div className="grid grid-cols-1 gap-4 items-center">
               <DatePicker
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
            </div>

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
                  {errors.adultCount && (
                     <span className="text-red-600">{errors.adultCount.message}</span>
                  )}
               </label>
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
            </div>
         </form>
      </div>
   );
}

export default BookHotelForm;
