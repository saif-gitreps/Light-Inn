import React from "react";
import Header from "../components/Header";

function Layout() {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />

         <Footer />
      </div>
   );
}

export default Layout;
