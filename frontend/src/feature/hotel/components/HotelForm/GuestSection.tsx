import { useFormContext } from "react-hook-form";
import { HotelFormData } from ".";

export default function GuestSection() {
   const {
      register,
      formState: { errors },
   } = useFormContext<HotelFormData>();

   return (
      <section className="flex flex-col gap-4">
         <div className="flex flex-col md:flex-row gap-5">
            <label
               htmlFor="adultCount"
               className="text-gray-700 text-md font-bold flex-1"
            >
               Number of adults:
               <input
                  type="number"
                  id="adultCount"
                  min={1}
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("adultCount", {
                     required: "Number of adults is required",
                  })}
               />
               {errors.adultCount && (
                  <span className="text-red-600">{errors.adultCount.message}</span>
               )}
            </label>

            <label
               htmlFor="childCount"
               className="text-gray-700 text-md font-bold flex-1"
            >
               Number of children:
               <input
                  type="number"
                  id="childCount"
                  min={0}
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("childCount", {
                     required: "Number of children is required",
                  })}
               />
               {errors.childCount && (
                  <span className="text-red-600">{errors.childCount.message}</span>
               )}
            </label>
         </div>
      </section>
   );
}
