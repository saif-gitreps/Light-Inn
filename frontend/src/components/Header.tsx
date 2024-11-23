import { Link } from "react-router-dom";

function Header() {
   return (
      <div className="bg-green-700 py-6">
         <div className="container mx-auto flex justify-between">
            <span className="text-2xl text-white font-semibold tracking-tighter">
               <Link to="/">Light Inn</Link>
            </span>
            <span className="flex space-x-2">
               <Link to="/login" className="text-white">
                  Login
               </Link>
               <Link to="/register" className="text-white">
                  Register
               </Link>
            </span>
         </div>
      </div>
   );
}

export default Header;
