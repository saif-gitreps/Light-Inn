import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const SearchBar = () => {
   const navigate = useNavigate();
   const search = useSearchContext();

   const [destination, setDestination] = useState<string>(search.destination);
   const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
   const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
   const [adultCount, setAdultCount] = useState<number>(search.adultCount);
   const [childCount, setChildCount] = useState<number>(search.childCount);

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);
      navigate("/search");
   };

   const minDate = new Date();
   const maxDate = new Date();
   maxDate.setFullYear(maxDate.getFullYear() + 1);

   return (
      <form
         onSubmit={handleSubmit}
         className="mb-8 absolute p-1 bg-white border rounded shadow-md grid grid-cols-2 md:grid-cols-3 md:flex items-center gap-1 justify-center"
      >
         <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded">
            <input
               placeholder="Your destination?"
               className="text-md w-full focus:outline-none"
               value={destination}
               onChange={(event) => setDestination(event.target.value)}
            />
         </div>

         <div className="flex bg-white px-2 py-1 gap-2 border rounded">
            <label className="items-center flex">
               Adults:
               <input
                  className="w-full p-1 focus:outline-none font-bold"
                  type="number"
                  min={1}
                  max={20}
                  value={adultCount}
                  onChange={(event) => setAdultCount(parseInt(event.target.value))}
               />
            </label>
            <label className="items-center flex">
               Child:
               <input
                  className="w-full p-1 focus:outline-none font-bold"
                  type="number"
                  min={0}
                  max={20}
                  value={childCount}
                  onChange={(event) => setChildCount(parseInt(event.target.value))}
               />
            </label>
         </div>

         <div className="">
            <DatePicker
               selected={checkIn}
               onChange={(date) => setCheckIn(date as Date)}
               selectsStart
               startDate={checkIn}
               endDate={checkOut}
               minDate={minDate}
               maxDate={maxDate}
               dateFormat="dd/MM/yyyy"
               placeholderText="Check-in Date"
               className="min-w-full bg-white p-2 focus:outline-none border rounded"
               wrapperClassName="min-w-full"
            />
         </div>
         <div className="">
            <DatePicker
               selected={checkOut}
               onChange={(date) => setCheckOut(date as Date)}
               selectsStart
               startDate={checkIn}
               endDate={checkOut}
               minDate={minDate}
               dateFormat="dd/MM/yyyy"
               maxDate={maxDate}
               placeholderText="Check-out Date"
               className="min-w-full bg-white p-2 focus:outline-none border rounded"
               wrapperClassName="min-w-full"
            />
         </div>
         <div className="flex-1">
            <Button className="w-1/2">Search</Button>
            <Button className="w-1/2">Clear</Button>
         </div>
      </form>
   );
};

export default SearchBar;
