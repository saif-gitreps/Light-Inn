import { Button } from "../../../components/ui/button";
import { LogOut } from "lucide-react";
import { useSignOut } from "../api/useSignOut";

function SignOutButton() {
   const { mutate: signOut } = useSignOut();

   return (
      <Button onClick={() => signOut()} variant="link" className="p-2 text-white">
         <LogOut />
         <span className="hidden md:inline">Sign out</span>
      </Button>
   );
}

export default SignOutButton;
