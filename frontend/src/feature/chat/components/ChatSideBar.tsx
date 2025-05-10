import React from "react";
import { Link, useParams } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";
import { ChatRoom, useChatRooms } from "../api/useChat";

interface ChatSidebarProps {
   currentUserId: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ currentUserId }) => {
   const { userId } = useParams<{ userId: string }>();
   const { rooms, isLoading, error } = useChatRooms();

   if (isLoading) {
      return <div className="p-4">Loading conversations...</div>;
   }

   if (error) {
      return <div className="p-4 text-red-500">Error loading conversations</div>;
   }

   // Find the other participant in each room (not the current user)
   const getChatPartner = (room: ChatRoom) => {
      return (
         room.participants.find((p) => p._id !== currentUserId) || room.participants[0]
      );
   };

   return (
      <div className="w-full h-full overflow-y-auto border-r">
         <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Messages</h2>
         </div>

         {rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
         ) : (
            <div>
               {rooms.map((room: ChatRoom) => {
                  const partner = getChatPartner(room);
                  const isActive = userId === partner._id;
                  const hasUnread =
                     room.lastMessage &&
                     !room.lastMessage.read &&
                     room.lastMessage.sender._id !== currentUserId;

                  return (
                     <Link
                        key={room._id}
                        to={`/messages/${partner._id}`}
                        className={`block p-4 border-b hover:bg-gray-100 ${
                           isActive ? "bg-gray-100" : ""
                        }`}
                     >
                        <div className="flex items-center">
                           {partner.firstName ? (
                              // <img
                              //    src={partner.avatar}
                              //    alt={partner.name}
                              //    className="w-12 h-12 rounded-full mr-3"
                              // />
                              <></>
                           ) : (
                              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                                 {partner.firstName.charAt(0).toUpperCase()}
                              </div>
                           )}

                           <div className="flex-1">
                              <div className="flex justify-between items-center">
                                 <h3 className="font-semibold">{partner.firstName}</h3>
                                 {room.lastActivity && (
                                    <span className="text-xs text-gray-500">
                                       {formatDistanceToNow(new Date(room.lastActivity), {
                                          addSuffix: true,
                                       })}
                                    </span>
                                 )}
                              </div>

                              {room.lastMessage && (
                                 <div className="flex justify-between items-center">
                                    <p
                                       className={`text-sm truncate ${
                                          hasUnread ? "font-semibold" : "text-gray-500"
                                       }`}
                                    >
                                       {room.lastMessage.content}
                                    </p>
                                    {hasUnread && (
                                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     </Link>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default ChatSidebar;
