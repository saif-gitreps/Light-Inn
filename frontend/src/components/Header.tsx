import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Hotel } from "lucide-react";

function Header() {
   return (
      <div className="bg-green-700 py-2">
         <div className="container mx-auto flex justify-between">
            <span className="text-2xl text-white font-semibold tracking-tighter flex items-center hover:opacity-80 underline">
               <Hotel size={24} />
               <Link to="/">Light Inn</Link>
            </span>
            <span className="flex space-x-1">
               <Button variant="link" asChild className="p-2">
                  <Link to="/sign-in" className="text-white">
                     Sign in
                  </Link>
               </Button>

               <Button variant="link" asChild className="p-2">
                  <Link to="/sign-up" className="text-white">
                     Sign up
                  </Link>
               </Button>
            </span>
         </div>
      </div>
   );
}

export default Header;
