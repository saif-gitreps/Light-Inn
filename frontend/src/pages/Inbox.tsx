import React from "react";
import ChatSidebar from "../feature/chat/components/ChatSideBar";
import { useAppContext } from "../contexts/AppContext";

const Inbox: React.FC = () => {
   const { currentUser } = useAppContext();

   return (
      <div className="flex h-screen">
         <div className="w-2/3 border-r">
            <ChatSidebar currentUserId={currentUser?._id as string} />
         </div>
      </div>
   );
};

export default Inbox;
