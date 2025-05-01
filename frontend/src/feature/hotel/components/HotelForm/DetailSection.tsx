import { useFormContext } from "react-hook-form";
import { HotelFormData } from ".";

function DetailsSection() {
   const {
      register,
      formState: { errors },
   } = useFormContext<HotelFormData>();

   return (
      <section className="flex flex-col gap-4">
         <label htmlFor="name" className="text-gray-700 text-md font-bold flex-1">
            Name:
            <input
               type="text"
               id="name"
               className="border w-full border-gray-400 rounded p-2 font-normal"
               {...register("name", {
                  required: "Name is required",
               })}
            />
            {errors.name && <span className="text-red-600">{errors.name.message}</span>}
         </label>

         <div className="flex flex-col md:flex-row gap-5">
            <label htmlFor="city" className="text-gray-700 text-md font-bold flex-1">
               City:
               <input
                  type="text"
                  id="city"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("city", {
                     required: "City is required",
                  })}
               />
               {errors.city && (
                  <span className="text-red-600">{errors.city.message}</span>
               )}
            </label>

            <label htmlFor="country" className="text-gray-700 text-md font-bold flex-1">
               Country:
               <input
                  type="text"
                  id="country"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("country", {
                     required: "Country is required",
                  })}
               />
               {errors.country && (
                  <span className="text-red-600">{errors.country.message}</span>
               )}
            </label>
         </div>

         <label htmlFor="description" className="text-gray-700 text-md font-bold flex-1">
            Description:
            <textarea
               rows={3}
               id="description"
               className="border w-full border-gray-400 rounded p-2 font-normal"
               {...register("description", {
                  required: "Description is required",
               })}
            ></textarea>
            {errors.description && (
               <span className="text-red-600">{errors.description.message}</span>
            )}
         </label>

         <div className="flex flex-col md:flex-row gap-5">
            <label
               htmlFor="pricePerNight"
               className="text-gray-700 text-md font-bold flex-1"
            >
               Price per night:
               <input
                  type="number"
                  id="pricePerNight"
                  min={1}
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("pricePerNight", {
                     required: "Price is required",
                  })}
               />
               {errors.pricePerNight && (
                  <span className="text-red-600">{errors.pricePerNight.message}</span>
               )}
            </label>

            <label htmlFor="rating" className="text-gray-700 text-md font-bold flex-1">
               Rating:
               <select
                  {...register("rating", {
                     required: "Rating is required",
                  })}
                  className="border w-full border-gray-400 rounded p-2 font-normal"
               >
                  <option value="" className="text-sm font-bold">
                     Select rating
                  </option>

                  {[1, 2, 3, 4, 5].map((rating) => (
                     <option key={rating} value={rating} className="text-sm font-bold">
                        {rating}
                     </option>
                  ))}
               </select>
               {errors.rating && (
                  <span className="text-red-600">{errors.rating.message}</span>
               )}
            </label>
         </div>
      </section>
   );
}

export default DetailsSection;
