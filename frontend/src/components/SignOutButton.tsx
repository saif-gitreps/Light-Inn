import { useMutation, useQueryClient } from "react-query";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiServices from "../api-services";

function SignOutButton() {
   const queryClient = useQueryClient();
   // const navigate = useNavigate();
   const { showToast } = useAppContext();

   const mutation = useMutation(apiServices.signOut, {
      onSuccess: async () => {
         await queryClient.invalidateQueries("validateToken");

         showToast({ message: "Signed out successfully!", type: "SUCCESS" });
      },
      onError: (error: Error) => {
         showToast({ message: error.message, type: "ERROR" });
      },
   });

   return (
      <Button onClick={() => mutation.mutate()} variant="link" className="p-2 text-white">
         <LogOut className="hidden sm:block" /> Sign out
      </Button>
   );
}

export default SignOutButton;
