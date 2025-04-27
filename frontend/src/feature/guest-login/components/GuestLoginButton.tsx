import { KeyRound } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

function GuestLoginButton() {
   const { mutate: loginUser, isPending } = useLoginUser();
   const { showToast } = useAppContext();
   const navigate = useNavigate();

   const onClick = (data: { email: string; password: string }) => {
      loginUser(data, {
         onSuccess: (response) => {
            showToast({ type: "SUCCESS", message: "Welcome back!" });
            login(response.data.user, response.data.accessToken);
            navigate("/");
         },
         onError: (error) => {
            showToast({ type: "ERROR", message: error.messaage });
         },
      });
   };

   return (
      <Button
         variant="secondary"
         disabled={isPending}
         onClick={() =>
            onClick({
               email: "test@test.com",
               password: "1234567",
            })
         }
      >
         {isPending ? (
            "Logging in..."
         ) : (
            <>
               Login as a guest <KeyRound />{" "}
            </>
         )}
      </Button>
   );
}

export default GuestLoginButton;
