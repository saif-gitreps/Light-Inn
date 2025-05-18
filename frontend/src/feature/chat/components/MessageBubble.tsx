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
      <div
         className={`border-t flex mb-4 pt-2 ${
            isCurrentUser ? "justify-end" : "justify-start"
         }`}
      >
         <div
            className={`flex flex-col items-${
               isCurrentUser ? "end" : "start"
            } max-w-[70%]`}
         >
            <div className="text-md font-semibold mb-1">{message.sender.firstName}</div>

            <div
               className={`p-3 rounded-lg ${
                  isCurrentUser
                     ? "bg-blue-600 text-white rounded-br-none"
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
      </div>
   );
};

export default MessageBubble;
