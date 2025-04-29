import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { HotelType } from "../../../../../../backend/src/shared/types";
import { Button } from "../../../../components/ui/button";
import DetailsSection from "./DetailSection";
import HotelTypeSection from "./HotelTypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

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

export default function HotelForm({ hotel, onSave, isLoading }: HotelFormProps) {
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
