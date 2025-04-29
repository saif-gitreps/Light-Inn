import { useParams } from "react-router-dom";
import { useFetchMyHotelById } from "../feature/hotel/api/useFetchMyHotelById";
import { useUpdateMyHotel } from "../feature/hotel/api/useUpdateMyHotel";
import HotelForm from "../feature/hotel/components/HotelForm";

function EditHotel() {
   const { id } = useParams<{ id: string }>();

   const { data: hotel } = useFetchMyHotelById(id as string);

   const { mutate, isLoading } = useUpdateMyHotel();

   const handleSave = (data: FormData) => {
      mutate(data);
   };

   return <HotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />;
}

export default EditHotel;
