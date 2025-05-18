import { useMutation, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import API_BASE_URL from "../../../config/base-url";
import { SignInFormData } from "../../../lib/shared-types";

const signIn = async (formData: SignInFormData) => {
   const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
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

   return responseBody;
};

export const useSignIn = () => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const location = useLocation();
   const { showToast } = useAppContext();

   return useMutation({
      mutationFn: signIn,
      onSuccess: async () => {
         showToast({ message: "Welcome back!", type: "SUCCESS" });

         await queryClient.invalidateQueries("currentUser");

         if (location.state?.from?.pathname) {
            navigate(location.state?.from?.pathname);
         } else {
            navigate("/");
         }
      },
      onError: (error: Error) => {
         showToast({ message: error.message, type: "ERROR" });
      },
   });
};
