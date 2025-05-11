import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

function NewChat() {
   const [search, setSearch] = useState<string>("");

   return (
      <div>
         <h1>Search user</h1>
         <input onChange={(event) => setSearch(event.target.value)} />
      </div>
   );
}

export default NewChat;
