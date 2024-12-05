import { useMutation } from "react-query";
import HotelForm from "../forms/HotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiServices from "../api-services";

function AddHotel() {
   const { showToast } = useAppContext();

   const { mutate, isLoading } = useMutation(apiServices.addHotel, {
      onSuccess: () => {
         showToast({ message: "Hotel saved successfully!", type: "SUCCESS" });
      },
      onError: () => {
         showToast({ message: "Something went wrong!", type: "ERROR" });
      },
   });

   const handleSave = (data: FormData) => {
      mutate(data);
   };
   return <HotelForm onSave={handleSave} isLoading={isLoading} />;
}

export default AddHotel;
