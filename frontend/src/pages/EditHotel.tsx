import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as hotelServices from "../services/hotel-services";
import HotelForm from "../forms/HotelForm";
import { useAppContext } from "../contexts/AppContext";

function EditHotel() {
   const { id } = useParams<{ id: string }>();
   const { showToast } = useAppContext();
   const navigate = useNavigate();

   const { data: hotel } = useQuery(
      "fetchMyHotelById",
      () => hotelServices.fetchMyHotelById(id as string),
      {
         enabled: !!id,
      }
   );

   const { mutate, isLoading } = useMutation(hotelServices.updatedMyHotel, {
      onSuccess: () => {
         showToast({ message: "Hotel updated successfully!", type: "SUCCESS" });
         navigate("/my-hotels");
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
