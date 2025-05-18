import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Message, useChatMessages } from "../api/useChat";
import { useAppContext } from "../../../contexts/AppContext";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ChatInterfaceProps {
   currentUserId: string;
   chatPartnerId: string;
   chatPartnerName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
   currentUserId,
   chatPartnerId,
   chatPartnerName,
}) => {
   const { currentUser } = useAppContext();
   const [messageInput, setMessageInput] = useState("");
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const processedMessageIds = useRef(new Set<string>());

   const {
      messages,
      isTyping,
      sendMessage,
      markAsRead,
      sendTypingIndicator,
      sendStopTypingIndicator,
   } = useChatMessages(chatPartnerId);

   // Scroll to bottom when messages change
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   // Mark unread messages as read
   useEffect(() => {
      if (messages.length > 0) {
         // Track which messages we've already processed to avoid loops
         const unreadMessages = messages
            .filter((msg: Message) => !msg.read && msg.sender._id !== currentUserId)
            .map((msg: Message) => msg._id);

         if (unreadMessages.length > 0) {
            // Use a ref to track messages we've already processed
            const messageIdsToMarkAsRead = unreadMessages.filter(
               (id) => !processedMessageIds.current.has(id)
            );

            if (messageIdsToMarkAsRead.length > 0) {
               // Add to processed set before making the API call
               messageIdsToMarkAsRead.forEach((id) =>
                  processedMessageIds.current.add(id)
               );
               markAsRead.mutate(messageIdsToMarkAsRead);
            }
         }
      }
   }, [messages, currentUserId, markAsRead]);

   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (messageInput.trim() && chatPartnerId) {
         sendMessage.mutate(messageInput);
         setMessageInput("");
         // Clear any typing indicator timeout
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
         }
         sendStopTypingIndicator();
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessageInput(e.target.value);

      // Send typing indicator with debounce
      sendTypingIndicator();

      // Clear previous timeout
      if (typingTimeoutRef.current) {
         clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
         sendStopTypingIndicator();
      }, 2000);
   };

   if (!chatPartnerId) {
      console.log("userId is not found");
      return (
         <div className="p-4 text-center">Select a conversation to start chatting</div>
      );
   }

   return (
      <div className="flex flex-col h-full">
         <h1 className="text-xl font-bold">
            <Button variant="outline">
               <Link to="/inbox" className="flex space-x-2 items-center">
                  <ArrowLeft /> Back
               </Link>
            </Button>{" "}
            <span className="text-gray-600">
               {chatPartnerName === "" ? "Owner" : chatPartnerName}
            </span>
         </h1>

         <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
               <span className="text-gray-600">Send a hello!</span>
            )}

            {messages.map((message: Message) => (
               <MessageBubble
                  key={message._id}
                  message={message}
                  isCurrentUser={message.sender._id === currentUser?._id}
               />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
         </div>

         <form onSubmit={handleSendMessage} className="p-4">
            <div className="flex">
               <textarea
                  className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleInputChange}
                  rows={1}
               />

               <Button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="rounded-l-none h-18"
               >
                  Send
               </Button>
            </div>
         </form>
      </div>
   );
};

export default ChatInterface;
