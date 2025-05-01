import { useMutation, useQueryClient } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { useAppContext } from "../../../contexts/AppContext";

export const signOut = async () => {
   const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to sign out");
   }
};

export const useSignOut = () => {
   const queryClient = useQueryClient();
   const { showToast } = useAppContext();

   return useMutation(signOut, {
      onSuccess: async () => {
         await queryClient.invalidateQueries("currentUser");

         showToast({ message: "Signed out successfully!", type: "SUCCESS" });
      },
      onError: (error: Error) => {
         showToast({ message: error.message, type: "ERROR" });
      },
   });
};
