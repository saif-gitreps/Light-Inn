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
      childCount: number,
      id: string
   ) => void;
};

const SearchContext = createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
   children: React.ReactNode;
};

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
   return <SearchContext.Provider value={}>{children}</SearchContext.Provider>;
};
