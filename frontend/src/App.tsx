import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/Layout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import UserHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";

function App() {
   const { isAuth } = useAppContext();

   return (
      <Router>
         <Routes>
            <Route
               path="/"
               element={
                  <Layout>
                     <h1>Home</h1>
                  </Layout>
               }
            />
            <Route
               path="/search"
               element={
                  <Layout>
                     <h1>Search</h1>
                  </Layout>
               }
            />
            <Route
               path="/sign-up"
               element={
                  <Layout>
                     <SignUp />
                  </Layout>
               }
            />

            <Route
               path="/sign-in"
               element={
                  <Layout>
                     <SignIn />
                  </Layout>
               }
            />

            {isAuth && (
               <>
                  <Route
                     path="/add-hotel"
                     element={
                        <Layout>
                           <AddHotel />
                        </Layout>
                     }
                  />
                  <Route
                     path="/my-hotels"
                     element={
                        <Layout>
                           <UserHotels />
                        </Layout>
                     }
                  />
                  <Route
                     path="/edit-hotel/:id"
                     element={
                        <Layout>
                           <EditHotel />
                        </Layout>
                     }
                  />
               </>
            )}
            <Route
               path="*"
               element={
                  <>
                     <Layout>
                        <h1 className="text-center font-semibold text-2xl">
                           404 Not Found
                        </h1>
                     </Layout>
                  </>
               }
            />
         </Routes>
      </Router>
   );
}

export default App;
