import { useEffect, useState } from "react";

import { useSearchUsers } from "../feature/Search/api/useSearchUsers";
import { UserType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Input } from "../components/ui/input";

function useDebounce<T>(value: T, delay: number): T {
   const [debouncedValue, setDebouncedValue] = useState(value);

   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      return () => {
         clearTimeout(handler);
      };
   }, [value, delay]);

   return debouncedValue;
}

function NewChat() {
   const [search, setSearch] = useState<string>("");
   const debouncedSearch = useDebounce(search, 500); // 500 ms
   const { data: users, isLoading } = useSearchUsers(debouncedSearch);

   return (
      <div className="space-y-2">
         <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <Input
               placeholder="Search a user"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </form>

         {isLoading && <div>Loading...</div>}

         {users?.map((user: UserType) => (
            <div key={user._id} className="flex space-x-2 shadow-md p-5">
               <div className="text-md">
                  {user.firstName && user.lastName
                     ? user.firstName + " " + user.lastName
                     : "random user lol"}
               </div>
               <div className="text-md">({user?.email ? user.email : "email"})</div>

               <Link to={`/inbox/${user._id}`}>
                  <MessageSquare className="stroke-blue-600 hover:opacity-60" />
               </Link>
            </div>
         ))}
      </div>
   );
}

export default NewChat;
