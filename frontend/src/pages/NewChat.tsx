import { useState } from "react";
import { useSearchUsers } from "../feature/Search/api/useSearchUsers";
import { UserType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

function NewChat() {
   const [search, setSearch] = useState<string>("");
   const { data: users, isLoading } = useSearchUsers(search);

   console.log(users);

   if (isLoading) {
      return (
         <div>
            <h1>Search user</h1>
            <div>Loading..</div>
         </div>
      );
   }

   return (
      <div>
         <h1>Search user:</h1>
         <input onChange={(event) => setSearch(event.target.value)} />

         {users?.map((user: UserType) => (
            <div key={user._id} className="flex space-x-2">
               <div className="text-md">
                  {user.firstName ? user.firstName : "random user lol"}
               </div>
               <Link to={`/inbox/${user._id}`}>
                  <MessageSquare />
               </Link>
            </div>
         ))}
      </div>
   );
}

export default NewChat;
