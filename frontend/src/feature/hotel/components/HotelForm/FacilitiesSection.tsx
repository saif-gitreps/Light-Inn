import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelForm";
import { hotelFacilities } from "../../../../config/hotel-options";

export default function FacilitiesSection() {
   const {
      register,
      formState: { errors },
   } = useFormContext<HotelFormData>();

   return (
      <section>
         <h2 className="text-xl font-bold mb-3">Facilities</h2>

         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {hotelFacilities.map((facility) => (
               <label
                  key={facility}
                  className="flex items-center text-base font-semibold hover:cursor-pointer"
               >
                  <input
                     type="checkbox"
                     {...register("facilities", {
                        validate: (facilities) => {
                           if (facilities.length === 0) {
                              return "Please select at least one facility";
                           } else {
                              return true;
                           }
                        },
                        required: "Please select a facility",
                     })}
                     value={facility}
                     className="mr-2 hover:cursor-pointer"
                  />
                  {facility}
               </label>
            ))}
         </div>

         {errors.facilities && (
            <span className="text-red-600 text-md font-bold">
               {errors.facilities.message}
            </span>
         )}
      </section>
   );
}
