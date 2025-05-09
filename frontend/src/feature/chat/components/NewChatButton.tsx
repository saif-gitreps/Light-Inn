import React, { useState } from "react";
import { useChat } from "../context/ChatContext";

interface NewChatButtonProps {
   users: { _id: string; username: string }[];
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ users }) => {
   const [isOpen, setIsOpen] = useState(false);
   const { startNewChat, rooms } = useChat();

   const handleStartChat = async (userId: string) => {
      try {
         await startNewChat(userId);
         setIsOpen(false);
      } catch (error) {
         console.error("Failed to start chat:", error);
      }
   };

   // Filter out users who already have a chat room
   const availableUsers = users.filter((user) => {
      return !rooms.some((room) =>
         room.participants.some((p) => typeof p === "object" && p._id === user._id)
      );
   });

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
         >
            New Chat
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border">
               <div className="p-2">
                  <h3 className="text-lg font-medium mb-2">Start a new chat</h3>
                  {availableUsers.length === 0 ? (
                     <p className="text-gray-500 text-sm">No users available</p>
                  ) : (
                     <ul className="max-h-60 overflow-y-auto">
                        {availableUsers.map((user) => (
                           <li key={user._id}>
                              <button
                                 onClick={() => handleStartChat(user._id)}
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                              >
                                 {user.username}
                              </button>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
               <div className="border-t p-2">
                  <button
                     onClick={() => setIsOpen(false)}
                     className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default NewChatButton;
