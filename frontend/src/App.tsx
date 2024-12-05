import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/Layout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";

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
               <Route
                  path="/add-hotel"
                  element={
                     <Layout>
                        <AddHotel />
                     </Layout>
                  }
               />
            )}
            <Route
               path="*"
               element={
                  <>
                     <>
                        <h1>404</h1>
                        <p>Page not found</p>
                     </>
                  </>
               }
            />
         </Routes>
      </Router>
   );
}

export default App;
