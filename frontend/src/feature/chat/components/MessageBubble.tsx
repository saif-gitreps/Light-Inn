import React from "react";

import { formatDistanceToNow } from "date-fns";
import { Message } from "../api/useChat";

interface MessageBubbleProps {
   message: Message;
   isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
   const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

   return (
      <div className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
         {!isCurrentUser && (
            <div className="flex-shrink-0 mr-2">
               {message.sender.firstName ? (
                  // <img
                  //    src={message.sender.avatar}
                  //    alt={message.sender.name}
                  //    className="w-8 h-8 rounded-full"
                  // />
                  <></>
               ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                     {message.sender.firstName.charAt(0).toUpperCase()}
                  </div>
               )}
            </div>
         )}

         <div className="max-w-[70%]">
            <div
               className={`p-3 rounded-lg ${
                  isCurrentUser
                     ? "bg-blue-500 text-white rounded-br-none"
                     : "bg-gray-200 text-gray-800 rounded-bl-none"
               }`}
            >
               {message.content}
            </div>
            <div
               className={`text-xs text-gray-500 mt-1 ${
                  isCurrentUser ? "text-right" : ""
               }`}
            >
               {timeAgo}
               {isCurrentUser && (
                  <span className="ml-2">{message.read ? "✓✓" : "✓"}</span>
               )}
            </div>
         </div>

         {isCurrentUser && (
            <div className="flex-shrink-0 ml-2">
               {message.sender.firstName ? (
                  // <img
                  //    src={message.sender.avatar}
                  //    alt={message.sender.name}
                  //    className="w-8 h-8 rounded-full"
                  // />
                  <></>
               ) : (
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                     {message.sender.firstName.charAt(0).toUpperCase()}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default MessageBubble;
