import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { hotelTypes, hotelFacilities } from "../config/hotel-options";
import { Button } from "../components/ui/button";
import { HotelType } from "../../../backend/src/shared/types";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export type HotelFormData = {
   name: string;
   city: string;
   country: string;
   description: string;
   type: string;
   pricePerNight: number;
   rating: number;
   facilities: string[];
   imageFiles: FileList;
   imageUrls: string[];
   adultCount: number;
   childCount: number;
};

type HotelFormProps = {
   hotel?: HotelType | undefined;
   onSave: (data: FormData) => void;
   isLoading: boolean;
};

function HotelForm({ hotel, onSave, isLoading }: HotelFormProps) {
   const formMethods = useForm<HotelFormData>();
   const {
      handleSubmit,
      reset,
      formState: { isSubmitting },
   } = formMethods;

   useEffect(() => {
      reset(hotel);
   }, [reset, hotel]);

   const onSubmit = handleSubmit((data: HotelFormData) => {
      const formData = new FormData();

      if (hotel) {
         formData.append("id", hotel._id);
      }

      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("country", data.country);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("pricePerNight", data.pricePerNight.toString());
      formData.append("rating", data.rating.toString());
      formData.append("adultCount", data.adultCount.toString());
      formData.append("childCount", data.childCount.toString());

      data.facilities.forEach((facility, index) => {
         formData.append(`facilities[${index}]`, facility);
      });

      Array.from(data.imageFiles).forEach((image) => {
         formData.append("imageFiles", image);
      });

      if (data.imageUrls) {
         data.imageUrls.forEach((imageUrl, index) => {
            formData.append(`imageUrls[${index}]`, imageUrl);
         });
      }

      onSave(formData);
   });

   return (
      <FormProvider {...formMethods}>
         <form className="space-y-8" onSubmit={onSubmit}>
            <h1 className="text-3xl font-bold mb-3">Add a new hotel</h1>

            <DetailsSection />
            <TypeSection />
            <FacilitiesSection />
            <GuestSection />
            <ImagesSection />

            <Button
               type="submit"
               className="w-36 text-lg"
               disabled={isLoading || isSubmitting}
            >
               Save
            </Button>
         </form>
      </FormProvider>
   );
}

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

function TypeSection() {
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

function FacilitiesSection() {
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

function GuestSection() {
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

function ImagesSection() {
   const {
      register,
      formState: { errors },
      watch,
      setValue,
   } = useFormContext<HotelFormData>();

   const existingImageUrls = watch("imageUrls");

   const handleDelete = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      imageUrl: string
   ) => {
      event.preventDefault();

      setValue(
         "imageUrls",
         existingImageUrls.filter((url) => url !== imageUrl)
      );
   };

   return (
      <div>
         <h2 className="text-xl font-bold mb-3">Images</h2>

         <div className="flex flex-col gap-4">
            {existingImageUrls && (
               <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {existingImageUrls.map((imageUrl) => (
                     <div className="relative group" key={imageUrl}>
                        <img src={imageUrl} className="min-h-full object-cover " />

                        <div
                           className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100"
                           onClick={(event) => handleDelete(event, imageUrl)}
                        >
                           <Trash2 className="stroke-red-500 hover:cursor-pointer" />
                        </div>
                     </div>
                  ))}
               </div>
            )}

            <input
               type="file"
               id="imageFiles"
               multiple
               accept="image/*"
               className="border w-full border-gray-400 rounded p-2 font-normal"
               {...register("imageFiles", {
                  validate: (images) => {
                     const totalImages = images.length + (existingImageUrls?.length || 0);

                     if (totalImages === 0) {
                        return "Please upload at least one image";
                     }

                     if (totalImages > 6) {
                        return "Maximum of 6 images allowed";
                     }
                  },
               })}
            />
         </div>

         {errors.imageFiles && (
            <span className="text-red-600 text-md font-bold">
               {errors.imageFiles.message}
            </span>
         )}
      </div>
   );
}

export default HotelForm;
