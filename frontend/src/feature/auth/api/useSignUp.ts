import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import { signUp } from "../services/auth-services";

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
