import React, { useState } from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatWindow from "./ChatWindow";
import ChatSidebar from "./ChatSideBar";
import { CurrentUser } from "../../../lib/shared-types";
import NewChatButton from "./NewChatButton";

interface ChatProps {
   currentUser: CurrentUser;
}

const MOCK_USERS = [
   { _id: "6749b5818e962b621e869bd1", username: "Hotel Owner 1" },
   { _id: "681e128bf90477da605e2945", username: "Hotel Owner 2" },
   { _id: "456789", username: "Guest 1" },
];

const Chat: React.FC<ChatProps> = ({ currentUser }) => {
   const [users, setUsers] = useState(MOCK_USERS);

   return (
      <ChatProvider currentUser={currentUser}>
         <NewChatButton users={users} />
         <div className="flex h-screen">
            <ChatSidebar currentUser={currentUser} />
            <ChatWindow currentUser={currentUser} />
         </div>
      </ChatProvider>
   );
};

export default Chat;
