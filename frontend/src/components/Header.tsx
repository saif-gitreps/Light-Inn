import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookCheck, Hotel, House, Inbox, Search } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "../feature/auth/components/SignOutButton";
import SearchBar from "../feature/Search/components/SearchBar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import GuestLoginButton from "../feature/guest-login/components/GuestLoginButton";

function Header() {
   const { isAuth } = useAppContext();

   return (
      <div className="bg-green-700 py-2 fixed top-0 w-full z-50">
         <div className="container mx-auto flex justify-between">
            <div className="flex items-center space-x-4">
               <span className="text-2xl text-white font-semibold tracking-tighter flex items-center hover:opacity-80 underline">
                  <Hotel size={26} className="" />
                  <Link to="/" className="hidden md:inline">
                     Light Inn
                  </Link>
                  <Link to="/" className="md:hidden inline">
                     L.i
                  </Link>
               </span>
               <Popover>
                  <PopoverTrigger className="flex items-center space-x-1">
                     <Button variant="link" className="text-white text-lg" asChild>
                        <span>
                           <span className="hidden lg:inline">Search</span>
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
                     <Button variant="link" className="p-2 text-white">
                        <Inbox />
                        <Link to="/inbox" className="hidden sm:block">
                           Inbox
                        </Link>
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

                     <GuestLoginButton className="text-gray-700 p-2" variant="outline">
                        Try as a guest
                     </GuestLoginButton>
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
