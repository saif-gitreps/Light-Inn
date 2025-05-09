import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { CurrentUser } from "../../../lib/shared-types";

interface ChatWindowProps {
   currentUser: CurrentUser;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser }) => {
   const { activeRoom, messages, sendMessage, typingUsers, setTypingStatus } = useChat();
   const [newMessage, setNewMessage] = useState("");
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLTextAreaElement>(null);
   const typingTimeoutRef = useRef<number | null>(null);

   // Scroll to bottom when messages change
   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
   }, [messages, activeRoom]);

   // Focus input when active room changes
   useEffect(() => {
      if (inputRef.current) {
         inputRef.current.focus();
      }
   }, [activeRoom]);

   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();

      if (!activeRoom || !newMessage.trim()) return;

      sendMessage(activeRoom._id, newMessage);
      setNewMessage("");
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNewMessage(value);

      if (!activeRoom) return;

      // Handle typing indicator
      if (value && !typingTimeoutRef.current) {
         setTypingStatus(activeRoom._id, true);

         // Clear typing status after 3 seconds of inactivity
         typingTimeoutRef.current = window.setTimeout(() => {
            setTypingStatus(activeRoom._id, false);
            typingTimeoutRef.current = null;
         }, 3000);
      } else if (!value) {
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
         }
         setTypingStatus(activeRoom._id, false);
      }
   };

   // Handle Enter key to send message, Shift+Enter for new line
   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSendMessage(e);
      }
   };

   if (!activeRoom) {
      return (
         <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
               <p className="text-xl">Select a conversation</p>
               <p className="mt-2">or start a new one</p>
            </div>
         </div>
      );
   }

   const roomMessages = messages[activeRoom._id] || [];
   const otherParticipant = activeRoom.participants.find(
      (p) => p._id !== currentUser._id
   );

   const isTyping = typingUsers[activeRoom._id]?.some((id) => id !== currentUser._id);

   return (
      <div className="flex-1 flex flex-col h-full">
         {/* Chat Header */}
         <div className="bg-white border-b p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
               {otherParticipant?.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
               <div className="font-medium">{otherParticipant?.username}</div>
               {isTyping && <div className="text-xs text-gray-500">typing...</div>}
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {roomMessages.length === 0 ? (
               <div className="flex justify-center items-center h-full">
                  <div className="text-center text-gray-500">
                     <p>No messages yet</p>
                     <p className="mt-2">Start the conversation!</p>
                  </div>
               </div>
            ) : (
               <div className="space-y-4">
                  {roomMessages.map((msg) => {
                     const isOwnMessage =
                        typeof msg.sender === "object"
                           ? msg.sender._id === currentUser._id
                           : msg.sender === currentUser._id;

                     return (
                        <div
                           key={msg._id}
                           className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                           }`}
                        >
                           <div
                              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                                 isOwnMessage
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-900"
                              }`}
                           >
                              {msg.content}
                              <div
                                 className={`text-xs mt-1 ${
                                    isOwnMessage ? "text-blue-200" : "text-gray-500"
                                 }`}
                              >
                                 {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                 })}
                              </div>
                           </div>
                        </div>
                     );
                  })}
                  <div ref={messagesEndRef} />
               </div>
            )}
         </div>

         {/* Input Area */}
         <div className="bg-white border-t p-4">
            <form onSubmit={handleSendMessage}>
               <div className="flex">
                  <textarea
                     ref={inputRef}
                     className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                     placeholder="Type a message..."
                     value={newMessage}
                     onChange={handleInputChange}
                     onKeyDown={handleKeyDown}
                     rows={1}
                  />
                  <button
                     type="submit"
                     className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                     disabled={!newMessage.trim()}
                  >
                     Send
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ChatWindow;
