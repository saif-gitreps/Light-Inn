import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiServices from "../api-services";
import HotelForm from "../forms/HotelForm";
import { useAppContext } from "../contexts/AppContext";

function EditHotel() {
   const { id } = useParams<{ id: string }>();
   const { showToast } = useAppContext();

   const { data: hotel } = useQuery(
      "fetchMyHotelById",
      () => apiServices.fetchMyHotelById(id as string),
      {
         enabled: !!id,
      }
   );

   const { mutate, isLoading } = useMutation(apiServices.updatedMyHotel, {
      onSuccess: () => {
         showToast({ message: "Hotel updated successfully!", type: "SUCCESS" });
      },
      onError: () => {
         showToast({ message: "Something went wrong while updating", type: "ERROR" });
      },
   });

   const handleSave = (data: FormData) => {
      mutate(data);
   };

   return <HotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />;
}

export default EditHotel;
