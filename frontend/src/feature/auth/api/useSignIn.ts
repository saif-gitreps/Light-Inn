import { useMutation, useQueryClient } from "react-query";
import { signIn } from "../services/auth-services";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";

export const useSignIn = () => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const location = useLocation();
   const { showToast } = useAppContext();

   return useMutation({
      mutationFn: signIn,
      onSuccess: async () => {
         showToast({ message: "Welcome back!", type: "SUCCESS" });

         await queryClient.invalidateQueries("validateToken");

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
