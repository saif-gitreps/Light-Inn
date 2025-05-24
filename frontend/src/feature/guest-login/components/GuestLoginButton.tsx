import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useAppContext } from "../../../contexts/AppContext";

import { useSignIn } from "../../auth/api/useSignIn";
import React from "react";

interface GuestLoginButtonProps {
   children: React.ReactNode;
   className?: string;
   variant:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | null
      | undefined;
}

function GuestLoginButton({ children, className, variant }: GuestLoginButtonProps) {
   const { mutate: signIn, isLoading } = useSignIn();
   const { showToast } = useAppContext();
   const navigate = useNavigate();

   const onClick = (data: { email: string; password: string }) => {
      signIn(data, {
         onSuccess: () => {
            showToast({ type: "SUCCESS", message: "Welcome back!" });

            navigate("/");

            window.location.reload();
         },
         onError: () => {
            showToast({
               type: "ERROR",
               message: "something went wrong while signing in",
            });
         },
      });
   };

   return (
      <Button
         variant={variant}
         disabled={isLoading}
         className={className}
         onClick={() =>
            onClick({
               email: "guest_lightin@gmail.com",
               password: "1234567",
            })
         }
      >
         {isLoading ? "Logging in..." : <>{children}</>}
      </Button>
   );
}

export default GuestLoginButton;
