import { Button } from "../../../components/ui/button";
import { LogOut } from "lucide-react";
import { useSignOut } from "../api/useSignOut";
import { useAppContext } from "../../../contexts/AppContext";

function SignOutButton() {
   const { mutate: signOut } = useSignOut();
   const { currentUser } = useAppContext();

   return (
      <Button onClick={() => signOut()} variant="link" className="p-2 text-white">
         <LogOut />
         <span className="hidden md:inline">Sign out ({currentUser?.firstName})</span>
      </Button>
   );
}

export default SignOutButton;
