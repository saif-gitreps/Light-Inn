import { useMutation } from "react-query";
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/base-url";

const addHotel = async (formData: FormData) => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "POST",
      credentials: "include",
      body: formData,
   });

   if (!response.ok) {
      throw new Error("Failed to add hotel");
   }

   return response.json();
};

export const useAddHotel = () => {
   const { showToast } = useAppContext();
   const navigate = useNavigate();

   return useMutation(addHotel, {
      onSuccess: () => {
         showToast({ message: "Hotel saved successfully!", type: "SUCCESS" });
         navigate("/my-hotels");
      },
      onError: () => {
         showToast({ message: "Something went wrong!", type: "ERROR" });
      },
   });
};
