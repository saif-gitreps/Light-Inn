import { Link } from "react-router-dom";

function Footer() {
   return (
      <div className="bg-green-700 py-6">
         <div className="container mx-auto flex justify-between items-center">
            <span className="text-3xl text-white font-bold tracking-tight underline hover:opacity-80">
               <Link to="/">Light Inn</Link>
            </span>
            <span className="text-white font-semibold tracking-tight flex gap-4">
               &copy; 2021 Light Inn. All rights reserved.
            </span>
         </div>
      </div>
   );
}

export default Footer;
