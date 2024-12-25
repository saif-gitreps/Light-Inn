import { useMutation } from "react-query";
import HotelForm from "../forms/HotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as hotelServices from "../services/hotel-services";
import { useNavigate } from "react-router-dom";

function AddHotel() {
   const { showToast } = useAppContext();
   const navigate = useNavigate();

   const { mutate, isLoading } = useMutation(hotelServices.addHotel, {
      onSuccess: () => {
         showToast({ message: "Hotel saved successfully!", type: "SUCCESS" });
         navigate("/my-hotels");
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
