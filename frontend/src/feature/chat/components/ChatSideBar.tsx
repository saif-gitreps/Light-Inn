import React from "react";
import { useChat } from "../context/ChatContext";
import { CurrentUser } from "../../../lib/shared-types";

interface ChatSidebarProps {
   currentUser: CurrentUser;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ currentUser }) => {
   const { rooms, activeRoom, setActiveRoom, loading } = useChat();

   if (loading) {
      return (
         <div className="w-64 bg-gray-100 h-full p-4">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold">Chats</h2>
            </div>
            <div className="flex justify-center items-center h-40">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-64 bg-gray-100 h-full p-4 border-r">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Chats</h2>
         </div>

         {rooms.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
               <p>No conversations yet</p>
            </div>
         ) : (
            <div className="space-y-2">
               {rooms.map((room) => {
                  // Find the other participant (not the current user)
                  const otherParticipant = room.participants.find(
                     (p) => p._id !== currentUser._id
                  );

                  return (
                     <div
                        key={room._id}
                        className={`p-3 rounded-lg cursor-pointer ${
                           activeRoom?._id === room._id
                              ? "bg-blue-100"
                              : "hover:bg-gray-200"
                        }`}
                        onClick={() => setActiveRoom(room._id)}
                     >
                        <div className="flex items-center">
                           <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              {otherParticipant?.firstName.charAt(0).toUpperCase()}
                           </div>
                           <div className="ml-3 overflow-hidden">
                              <div className="font-medium">
                                 {otherParticipant?.firstName}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                 {room.lastMessage
                                    ? room.lastMessage.content
                                    : "No messages yet"}
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default ChatSidebar;
