import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getSocket } from "../../../lib/websocket";
import API_BASE_URL from "../../../config/base-url";
import { UserType } from "../../../../../backend/src/shared/types";

// Types
// export interface User {
//    _id: string;
//    name: string;
//    avatar?: string;
// }

export interface Message {
   _id: string;
   content: string;
   sender: UserType;
   receiver: UserType;
   timestamp: Date;
   read: boolean;
}

export interface ChatRoom {
   _id: string;
   participants: UserType[];
   lastMessage?: Message;
   lastActivity: Date;
}

// Hook to get all chat rooms for the current user
export const useChatRooms = () => {
   // const queryClient = useQueryClient();

   const { data: rooms = [], ...rest } = useQuery({
      queryKey: ["chatRooms"],
      queryFn: async () => {
         const response = await axios.get(`${API_BASE_URL}/api/chat/rooms`, {
            withCredentials: true,
         });
         return response.data;
      },
   });

   // Socket listener for new messages to update rooms
   // useEffect(() => {
   //    const socket = getSocket();
   //    if (!socket) return;

   //    const handleNewMessage = () => {
   //       // Update the chat rooms list when a new message arrives
   //       queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
   //    };

   //    socket.on("private-message", handleNewMessage);

   //    return () => {
   //       socket.off("private-message", handleNewMessage);
   //    };
   // }, [queryClient]);

   return { rooms, ...rest };
};

// Hook to get messages for a specific chat
export const useChatMessages = (userId?: string) => {
   const queryClient = useQueryClient();
   const [isTyping, setIsTyping] = useState(false);

   const { data, ...rest } = useQuery({
      queryKey: ["chatMessages", userId],
      queryFn: async () => {
         if (!userId) return { roomId: "", messages: [] };

         const response = await axios.get(
            `${API_BASE_URL}/api/chat/messages/user/${userId}`,
            {
               withCredentials: true,
            }
         );
         return response.data;
      },
      enabled: !!userId,
   });

   const messages: Message[] = data?.messages || [];
   const roomId: string = data?.roomId || "";

   // Socket listeners for real-time updates
   useEffect(() => {
      const socket = getSocket();

      if (!socket || !userId) return;

      const handleNewMessage = (message: Message) => {
         // Only update if message is from current chat
         if (
            (message.sender._id === userId || message.receiver._id === userId) &&
            message._id
         ) {
            queryClient.invalidateQueries({ queryKey: ["chatMessages", userId] });
            // queryClient.invalidateQueries({ queryKey: ["chatRooms"] });

            // Mark the message as read if we're the receiver
            if (message.receiver._id !== userId && !message.read) {
               socket.emit("mark-read", { messageIds: [message._id] });
            }
         }
      };

      const handleTyping = (data: { userId: string }) => {
         if (data.userId === userId) {
            setIsTyping(true);
            // Auto reset typing indicator after 3 seconds
            setTimeout(() => setIsTyping(false), 3000);
         }
      };

      const handleStopTyping = (data: { userId: string }) => {
         if (data.userId === userId) {
            setIsTyping(false);
         }
      };

      socket.on("private-message", handleNewMessage);
      socket.on("typing", handleTyping);
      socket.on("stop-typing", handleStopTyping);

      return () => {
         socket.off("private-message", handleNewMessage);
         socket.off("typing", handleTyping);
         socket.off("stop-typing", handleStopTyping);
      };
   }, [userId, queryClient]);

   // Send message mutation
   const sendMessage = useMutation({
      mutationFn: async (content: string) => {
         const socket = getSocket();
         if (!socket || !userId)
            throw new Error("Socket not connected or userId missing");

         return new Promise<void>((resolve) => {
            socket.emit("private-message", { receiverId: userId, content });
            resolve();
         });
      },
   });

   // Mark messages as read
   const markAsRead = useMutation({
      mutationFn: async (messageIds: string[]) => {
         return axios.put(
            `${API_BASE_URL}/api/chat/messages/read`,
            { messageIds },
            { withCredentials: true }
         );
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["chatMessages", userId] });
      },
   });

   // Send typing indicators
   const sendTypingIndicator = () => {
      const socket = getSocket();
      if (!socket || !userId) return;

      socket.emit("typing", { receiverId: userId });
   };

   const sendStopTypingIndicator = () => {
      const socket = getSocket();
      if (!socket || !userId) return;

      socket.emit("stop-typing", { receiverId: userId });
   };

   return {
      messages,
      roomId,
      isTyping,
      sendMessage,
      markAsRead,
      sendTypingIndicator,
      sendStopTypingIndicator,
      ...rest,
   };
};
