import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { CurrentUser } from "../lib/shared-types";
import { useFetchCurrentUser } from "../feature/auth/api/useFetchCurrentUser";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

type ToastMessage = {
   message: string;
   type: "SUCCESS" | "ERROR";
};

type AppContext = {
   showToast: (message: ToastMessage) => void;
   isAuth: boolean;
   currentUser: CurrentUser | undefined;
   stripePromise: Promise<Stripe | null>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

   const { data: currentUser, isError } = useFetchCurrentUser({ retry: 2 });

   console.log(currentUser);

   return (
      <AppContext.Provider
         value={{
            showToast: (message) => {
               setToast(message);
            },
            isAuth: !isError,
            currentUser,
            stripePromise,
         }}
      >
         {toast && (
            <Toast
               message={toast.message}
               type={toast.type}
               onclose={() => setToast(undefined)}
            />
         )}
         {children}
      </AppContext.Provider>
   );
};

export const useAppContext = () => {
   const context = useContext(AppContext);

   return context as AppContext;
};
