import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

function SearchBar() {
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

   const handleClear = () => {
      search.clearSearchValues();
      setDestination("");
      setCheckIn(new Date());
      setCheckOut(new Date());
      setAdultCount(1);
      setChildCount(0);
   };

   const minDate = new Date();
   const maxDate = new Date();
   maxDate.setFullYear(maxDate.getFullYear() + 1);

   return (
      <form
         onSubmit={handleSubmit}
         className="p-1 bg-white border rounded shadow-md grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-1 justify-center"
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

         <div className="flex-1">
            <DatePicker
               selected={checkIn}
               onChange={(date) => setCheckIn(date as Date)}
               selectsStart
               startDate={checkIn}
               endDate={checkOut}
               minDate={minDate}
               maxDate={maxDate}
               showDateSelect={false}
               dateFormat="dd/MM/yyyy"
               placeholderText="Check-in Date"
               className="w-full bg-white p-2 focus:outline-none border rounded"
               showIcon
               wrapperClassName="w-full"
            />
         </div>

         <div className="flex-1">
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
               className="w-full bg-white p-2 focus:outline-none border rounded"
               showIcon
               wrapperClassName="w-full"
            />
         </div>

         <div className="flex-1 sm:flex justify-center">
            <Button className="w-1/2" variant="outline" type="submit">
               <Search size={42} className="" />
            </Button>

            <Button
               className="w-1/2"
               variant="destructive"
               type="button"
               onClick={handleClear}
            >
               Reset
            </Button>
         </div>
      </form>
   );
}

export default SearchBar;
