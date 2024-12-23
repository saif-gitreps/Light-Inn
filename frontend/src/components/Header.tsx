import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookCheck, Hotel, Search } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import SearchBar from "./SearchBar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function Header() {
   const { isAuth } = useAppContext();

   return (
      <div className="bg-green-700 py-2 fixed top-0 w-full z-50">
         <div className="container mx-auto flex justify-between">
            <div className="flex items-center space-x-4">
               <span className="text-2xl text-white font-semibold tracking-tighter flex items-center hover:opacity-80 underline">
                  <Hotel size={26} />
                  <Link to="/" className="hidden md:inline">
                     Light Inn
                  </Link>
               </span>
               <Popover>
                  <PopoverTrigger className="flex items-center space-x-1">
                     <Button variant="link" className="text-white text-lg">
                        Search <Search className="hover:opacity-80" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent
                     className="w-screen p-1 bg-transparent border-none shadow-none"
                     side="top"
                     align="center"
                  >
                     <div className="container mx-auto">
                        <SearchBar />
                     </div>
                  </PopoverContent>
               </Popover>
            </div>
            <span className="flex space-x-1">
               {isAuth ? (
                  <>
                     <Button variant="link" className="p-2 text-white">
                        <BookCheck className="hidden sm:block" />
                        <Link to="/booked-rooms">Booked rooms</Link>
                     </Button>
                     <Button variant="link" className="p-2 text-white">
                        <Hotel className="hidden sm:block" />
                        <Link to="/my-hotels">My Hotels</Link>
                     </Button>
                     <SignOutButton />
                  </>
               ) : (
                  <>
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
                  </>
               )}
            </span>
         </div>
         {/* <div className="container mx-auto">
            <SearchBar />
         </div> */}
      </div>
   );
}

export default Header;
