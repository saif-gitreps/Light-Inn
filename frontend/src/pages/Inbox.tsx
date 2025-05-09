import { useState } from "react";
import NewChatButton from "../feature/chat/components/NewChatButton";

import Chat from "../feature/chat/components/Chat";

// Mock current user for demo purposes
// In a real app, this would come from authentication
const MOCK_CURRENT_USER = {
   _id: "123456",
   email: "sadfa@gmail.com",
   firstName: "hello",
   lastName: "hello",
};

// Mock other users for demo purposes
const MOCK_USERS = [
   { _id: "234567", username: "Hotel Owner 1" },
   { _id: "345678", username: "Hotel Owner 2" },
   { _id: "456789", username: "Guest 1" },
];

function Inbox() {
   const [currentUser, setCurrentUser] = useState(MOCK_CURRENT_USER);
   // In a real app, you would fetch this from your API
   const [users, setUsers] = useState(MOCK_USERS);

   return (
      <div className="h-screen flex flex-col">
         <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
               <h1 className="text-xl font-bold">Hotel Booking Chat</h1>
               <div className="flex items-center space-x-4">
                  {/* <NewChatButton users={users} />
                  <div className="text-sm">
                     Logged in as{" "}
                     <span className="font-medium">{currentUser.firstName}</span>
                  </div> */}
               </div>
            </div>
         </header>

         <main className="flex-1 container mx-auto my-4 overflow-hidden">
            <div className="bg-white rounded-lg shadow-md h-full overflow-hidden">
               <Chat currentUser={currentUser} />
            </div>
         </main>
      </div>
   );
}

export default Inbox;
