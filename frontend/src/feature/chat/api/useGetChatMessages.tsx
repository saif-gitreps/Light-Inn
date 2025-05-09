import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { ChatMessage } from "../../../lib/shared-types";

const getChatMessages = async (
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

export const useGetChatMessages = (
   roomId: string,
   limit: number = 50,
   offset: number = 0
) => {
   return useQuery("chatMessages", {
      queryFn: () => getChatMessages(roomId, limit, offset),
   });
};
