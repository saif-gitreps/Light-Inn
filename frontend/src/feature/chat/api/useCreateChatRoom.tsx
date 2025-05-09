import { useMutation } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { useAppContext } from "../../../contexts/AppContext";
import { ChatRoom } from "../../../lib/shared-types";

const createChatRoom = async (userId: string): Promise<ChatRoom> => {
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

export const useCreateChatRoom = () => {
   const { showToast } = useAppContext();
   return useMutation(createChatRoom, {
      onSuccess: () => {
         showToast({ message: "New chat created successfully", type: "SUCCESS" });
      },
      onError: () => {
         showToast({ message: "Something went wrong!", type: "ERROR" });
      },
   });
};
