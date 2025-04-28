import { useAddHotel } from "../feature/hotel/api/useAddHotel";
import HotelForm from "../feature/hotel/components/HotelForm/HotelForm";

function AddHotel() {
   const { mutate, isLoading } = useAddHotel();

   const handleSave = (data: FormData) => {
      mutate(data);
   };
   return <HotelForm onSave={handleSave} isLoading={isLoading} />;
}

export default AddHotel;
