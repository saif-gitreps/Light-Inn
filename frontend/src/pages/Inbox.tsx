import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { disconnectSocket, initializeSocket } from "../lib/websocket";
import ChatInterface from "../feature/chat/components/ChatInterface";
import ChatSidebar from "../feature/chat/components/ChatSideBar";
import { useAppContext } from "../contexts/AppContext";

const Inbox: React.FC = () => {
   const location = useLocation();
   const { currentUser, isAuth } = useAppContext();

   // Initialize socket on component mount
   useEffect(() => {
      initializeSocket();

      // Cleanup on unmount
      return () => {
         disconnectSocket();
      };
   }, [currentUser]);

   // if (!currentUser) {
   //    return <Navigate to="/" state={{ from: location }} replace />;
   // }

   return (
      <div className="flex h-screen">
         <div className="w-1/3 border-r">
            <ChatSidebar currentUserId={currentUser?._id as string} />
         </div>
         <div className="w-2/3">
            <ChatInterface currentUserId={currentUser?._id as string} />
         </div>
      </div>
   );
};

export default Inbox;
