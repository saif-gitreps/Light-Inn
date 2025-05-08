import API_BASE_URL from "../../../config/base-url";
import { ChatRoom, ChatMessage } from "../../../lib/shared-types";

// Get all chat rooms for current user
export const getChatRooms = async (): Promise<ChatRoom[]> => {
   const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to get rooms");
   }

   return response.json();
};

// Get messages for a specific chat room
export const getChatMessages = async (
   roomId: string,
   limit: number = 50,
   offset: number = 0
): Promise<ChatMessage[]> => {
   const queryParam = new URLSearchParams();

   queryParam.append("limit", limit?.toString() || "");
   queryParam.append("offset", offset?.toString() || "");

   const response = await fetch(
      `${API_BASE_URL}/api/chat/rooms/${roomId}/messages?${queryParam}`,
      {
         method: "GET",
         credentials: "include",
      }
   );

   if (!response.ok) {
      throw new Error("Failed to get messages of room: " + roomId);
   }

   return response.json();
};

// Create a new chat room with another user
export const createChatRoom = async (userId: string): Promise<ChatRoom> => {
   const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
      method: "POST",
      credentials: "include",
      body: userId,
   });

   if (!response.ok) {
      throw new Error("Failed to create rooms");
   }

   return response.json();
};
