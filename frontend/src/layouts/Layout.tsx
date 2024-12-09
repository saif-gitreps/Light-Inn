import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";

interface LayoutProps {
   children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <div className="container mx-auto relative flex justify-center">
            <SearchBar />
         </div>
         <Hero />
         <main className="container mx-auto py-10 flex-1">{children}</main>
         <Footer />
      </div>
   );
}

export default Layout;
