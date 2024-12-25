import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookCheck, Hotel, House, Search } from "lucide-react";
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
                  <Hotel size={26} className="hidden md:inline" />
                  <Link to="/">Light Inn</Link>
               </span>
               <Popover>
                  <PopoverTrigger className="flex items-center space-x-1">
                     <Button variant="link" className="text-white text-lg" asChild>
                        <span>
                           <span className="hidden md:inline">Search</span>
                           <Search className="hover:opacity-80" />
                        </span>
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-screen p-1 bg-transparent border-none shadow-none">
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
                        <BookCheck />
                        <Link to="/booked-rooms" className="hidden sm:block">
                           Booked rooms
                        </Link>
                     </Button>
                     <Button variant="link" className="p-2 text-white">
                        <House />
                        <Link to="/my-hotels" className="hidden sm:block">
                           My Hotels
                        </Link>
                     </Button>
                     <SignOutButton />
                  </>
               ) : (
                  <>
                     <Button variant="link" asChild className="p-2">
                        <Link to="/sign-in" className="text-white hidden sm:block">
                           Sign in
                        </Link>
                     </Button>

                     <Button variant="link" asChild className="p-2">
                        <Link to="/sign-up" className="text-white hidden sm:block">
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
