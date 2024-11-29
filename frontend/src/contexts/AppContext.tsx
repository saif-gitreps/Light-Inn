import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiServices from "../api-services";

type ToastMessage = {
   message: string;
   type: "SUCCESS" | "ERROR";
};

type AppContext = {
   showToast: (message: ToastMessage) => void;
   isAuth: boolean;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

   const { isError } = useQuery("validateToken", apiServices.validateToken, {
      retry: false,
   });

   return (
      <AppContext.Provider
         value={{
            showToast: (message) => {
               setToast(message);
            },
            isAuth: !isError,
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
