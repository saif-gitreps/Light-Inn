import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { HotelType } from "../../../../../../backend/src/shared/types";
import { Button } from "../../../../components/ui/button";
import DetailsSection from "./DetailSection";
import HotelTypeSection from "./HotelTypeSection";

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
            <h1 className="text-3xl font-bold mb-3">
               {hotel ? "Update" : "Add a new"} hotel
            </h1>

            <DetailsSection />
            <HotelTypeSection />
            <FacilitiesSection />
            <GuestSection />
            <ImagesSection />

            <Button
               type="submit"
               className="w-36 text-lg"
               disabled={isLoading || isSubmitting}
            >
               {isLoading || isSubmitting ? "Saving.." : "Save"}
            </Button>
         </form>
      </FormProvider>
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
