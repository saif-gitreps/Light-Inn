import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { ChatRoom } from "../../../lib/shared-types";

const getChatRooms = async (): Promise<ChatRoom[]> => {
   const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to get rooms");
   }

   return response.json();
};

export const useGetChatRoom = () => {
   return useQuery("chatRooms", {
      queryFn: getChatRooms,
   });
};
