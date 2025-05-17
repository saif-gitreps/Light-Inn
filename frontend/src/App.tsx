import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/Layout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import UserHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import SearchResult from "./pages/SearchResult";
import Details from "./pages/Details";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import Inbox from "./pages/Inbox";
import NewChat from "./pages/NewChat";
import Chat from "./pages/Chat";

function App() {
   const { isAuth } = useAppContext();

   return (
      <Router>
         <Routes>
            <Route
               path="/"
               element={
                  <Layout>
                     <Home />
                  </Layout>
               }
            />
            <Route
               path="/search"
               element={
                  <Layout>
                     <SearchResult />
                  </Layout>
               }
            />
            <Route
               path="/detail/:id"
               element={
                  <Layout>
                     <Details />
                  </Layout>
               }
            />

            {!isAuth && (
               <>
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
               </>
            )}

            {isAuth && (
               <>
                  <Route
                     path="/hotel/:id/booking"
                     element={
                        <Layout>
                           <Booking />
                        </Layout>
                     }
                  />

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
                     path="/booked-rooms"
                     element={
                        <Layout>
                           <MyBookings />
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
                  <Route
                     path="/inbox"
                     element={
                        <Layout>
                           <Inbox />
                        </Layout>
                     }
                  />
                  <Route
                     path="/chat/:partnerId/:partnerName"
                     element={
                        <Layout>
                           <Chat />
                        </Layout>
                     }
                  />
                  <Route
                     path="/inbox/new"
                     element={
                        <Layout>
                           <NewChat />
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
