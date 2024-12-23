import Footer from "../components/Footer";
import Header from "../components/Header";

interface LayoutProps {
   children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <main className="container mx-auto py-16 flex-1">{children}</main>
         <Footer />
      </div>
   );
}

export default Layout;
