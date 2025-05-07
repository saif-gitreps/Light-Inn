import axios from "axios";
import { ChatRoom, ChatMessage } from "../../../lib/shared-types";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Set up axios instance with auth header
const api = axios.create({
   baseURL: API_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Add token to requests
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// Get all chat rooms for current user
export const getChatRooms = async (): Promise<ChatRoom[]> => {
   const response = await api.get("/chat/rooms");
   return response.data;
};

// Get messages for a specific chat room
export const getChatMessages = async (
   roomId: string,
   limit: number = 50,
   offset: number = 0
): Promise<ChatMessage[]> => {
   const response = await api.get(`/chat/rooms/${roomId}/messages`, {
      params: { limit, offset },
   });
   return response.data;
};

// Create a new chat room with another user
export const createChatRoom = async (userId: string): Promise<ChatRoom> => {
   const response = await api.post("/chat/rooms", { userId });
   return response.data;
};
