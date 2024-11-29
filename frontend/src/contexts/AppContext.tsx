import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

type ToastMessage = {
   message: string;
   type: "SUCCESS" | "ERROR";
};

type AppContext = {
   showToast: (message: ToastMessage) => void;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

   return (
      <AppContext.Provider
         value={{
            showToast: (message) => {
               setToast(message);
            },
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
