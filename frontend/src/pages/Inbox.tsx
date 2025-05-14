import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { disconnectSocket, initializeSocket } from "../lib/websocket";
import ChatInterface from "../feature/chat/components/ChatInterface";
import ChatSidebar from "../feature/chat/components/ChatSideBar";
import { useAppContext } from "../contexts/AppContext";

const Inbox: React.FC = () => {
   const { currentUser } = useAppContext();

   useEffect(() => {
      initializeSocket();

      return () => {
         disconnectSocket();
      };
   }, [currentUser]);

   const { userId } = useParams<{ userId: string }>();

   return (
      <div className="flex h-screen">
         <div className="w-1/3 border-r">
            <ChatSidebar currentUserId={currentUser?._id as string} />
         </div>
         <div className="w-2/3">
            {userId ? (
               <ChatInterface currentUserId={currentUser?._id as string} />
            ) : (
               <div className="h-full flex items-center justify-center text-gray-500">
                  Select a conversation to start chatting
               </div>
            )}
         </div>
      </div>
   );
};

export default Inbox;
