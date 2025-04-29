import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import API_BASE_URL from "../../../config/base-url";
import { SignUpFormData } from "../../../lib/shared-types";

const signUp = async (formData: SignUpFormData): Promise<void> => {
   const response = await fetch(`${API_BASE_URL}/api/users/sign-up`, {
      method: "POST",
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
   });

   const responseBody = await response.json();

   if (!response.ok) {
      throw new Error(responseBody.message);
   }
};

export const useSignUp = () => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { showToast } = useAppContext();

   return useMutation({
      mutationFn: signUp,
      onSuccess: async () => {
         showToast({ message: "Account created successfully!", type: "SUCCESS" });

         await queryClient.invalidateQueries("validateToken");

         navigate("/");
      },
      onError: (error: Error) => {
         showToast({ message: error.message, type: "ERROR" });
      },
   });
};
