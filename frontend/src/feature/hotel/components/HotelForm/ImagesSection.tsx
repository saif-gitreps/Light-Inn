import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { HotelFormData } from ".";

export default function ImagesSection() {
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
         existingImageUrls.filter((url: string) => url !== imageUrl)
      );
   };

   return (
      <div>
         <h2 className="text-xl font-bold mb-3">Images</h2>

         <div className="flex flex-col gap-4">
            {existingImageUrls && (
               <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {existingImageUrls.map((imageUrl: string) => (
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
