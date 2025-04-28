import { useMutation } from "react-query";
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/base-url";

const updatedMyHotel = async (formData: FormData) => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels/${formData.get("id")}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
   });

   if (!response.ok) {
      throw new Error("Failed to update hotel");
   }

   return response.json();
};

export const useUpdateMyHotel = () => {
   const { showToast } = useAppContext();
   const navigate = useNavigate();

   return useMutation(updatedMyHotel, {
      onSuccess: () => {
         showToast({ message: "Hotel updated successfully!", type: "SUCCESS" });
         navigate("/my-hotels");
      },
      onError: () => {
         showToast({ message: "Something went wrong while updating", type: "ERROR" });
      },
   });
};
