import React, { createContext, useContext, useState } from "react";

type SearchContext = {
   destination: string;
   checkIn: Date;
   checkOut: Date;
   adultCount: number;
   childCount: number;
   id: string;
   saveSearchValues: (
      destination: string,
      checkIn: Date,
      checkOut: Date,
      adultCount: number,
      childCount: number
   ) => void;
   clearSearchValues: () => void;
};

const SearchContext = createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
   children: React.ReactNode;
};

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
   const [destination, setDestination] = useState<string>(
      () => sessionStorage.getItem("destination") || ""
   );
   const [checkIn, setCheckIn] = useState<Date>(
      () => new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
   );
   const [checkOut, setCheckOut] = useState<Date>(
      () => new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
   );
   const [adultCount, setAdultCount] = useState<number>(() =>
      parseInt(sessionStorage.getItem("adultCount") || "1")
   );
   const [childCount, setChildCount] = useState<number>(() =>
      parseInt(sessionStorage.getItem("childCount") || "1")
   );
   const [id, setId] = useState<string>(() => sessionStorage.getItem("id") || "");
   const saveSearchValues = (
      destination: string,
      checkIn: Date,
      checkOut: Date,
      adultCount: number,
      childCount: number,
      id?: string
   ) => {
      setDestination(destination);
      setCheckIn(checkIn);
      setCheckOut(checkOut);
      setAdultCount(adultCount);
      setChildCount(childCount);
      if (id) setId(id);

      sessionStorage.setItem("destination", destination);
      sessionStorage.setItem("checkIn", checkIn.toISOString());
      sessionStorage.setItem("checkOut", checkOut.toISOString());
      sessionStorage.setItem("adultCount", adultCount.toString());
      sessionStorage.setItem("childCount", childCount.toString());
      if (id) sessionStorage.setItem("id", id);
   };

   const clearSearchValues = () => {
      setDestination("");
      setCheckIn(new Date());
      setCheckOut(new Date());
      setAdultCount(1);
      setChildCount(0);
      setId("");

      sessionStorage.setItem("destination", "");
      sessionStorage.setItem("checkIn", new Date().toISOString());
      sessionStorage.setItem("checkOut", new Date().toISOString());
      sessionStorage.setItem("adultCount", "1");
      sessionStorage.setItem("childCount", "0");
      sessionStorage.setItem("id", "");
   };

   return (
      <SearchContext.Provider
         value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            id,
            saveSearchValues,
            clearSearchValues,
         }}
      >
         {children}
      </SearchContext.Provider>
   );
};

export const useSearchContext = () => {
   const context = useContext(SearchContext);
   return context as SearchContext;
};
