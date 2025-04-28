import { useMutation, useQueryClient } from "react-query";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import * as authServices from "../feature/auth/services/auth-services";

function SignOutButton() {
   const queryClient = useQueryClient();
   const { showToast } = useAppContext();

   const mutation = useMutation(authServices.signOut, {
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
         <LogOut />
         <span className="hidden md:inline">Sign out</span>
      </Button>
   );
}

export default SignOutButton;
