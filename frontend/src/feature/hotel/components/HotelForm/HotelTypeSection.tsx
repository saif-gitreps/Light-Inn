import { useFormContext } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { HotelFormData } from "./HotelForm";
import { hotelTypes } from "../../../../config/hotel-options";

function HotelTypeSection() {
   const {
      register,
      watch,
      formState: { errors },
   } = useFormContext<HotelFormData>();
   const typeWatch = watch("type");

   return (
      <section>
         <h2 className="text-xl font-bold mb-3">Type</h2>

         <div className="grid grid-cols-5 gap-2">
            {hotelTypes.map((type) => (
               <Button
                  key={type}
                  asChild
                  variant={typeWatch === type ? "outline" : "secondary"}
               >
                  <label className="flex items-center text-lg font-semibold hover:cursor-pointer border">
                     <input
                        type="radio"
                        {...register("type", {
                           required: "Please select a type",
                        })}
                        value={type}
                        className="mr-2 hover:cursor-pointer hidden"
                     />
                     {type}
                  </label>
               </Button>
            ))}
         </div>

         {errors.type && (
            <span className="text-red-600 text-md font-bold">{errors.type.message}</span>
         )}
      </section>
   );
}

export default HotelTypeSection;
