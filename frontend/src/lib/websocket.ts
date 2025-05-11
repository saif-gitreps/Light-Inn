import { io, Socket } from "socket.io-client"; // Assuming you have this

let socket: Socket | null = null;

export const initializeSocket = () => {
   // const token = getAuthToken();

   if (!socket) {
      socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", {
         autoConnect: true,
         reconnection: true,
         withCredentials: true,
      });

      socket.on("connect", () => {
         console.log("Socket connected");
      });

      socket.on("disconnect", () => {
         console.log("Socket disconnected");
      });

      socket.on("error", (error) => {
         console.error("Socket error:", error);
      });
   }

   return socket;
};

export const getSocket = () => {
   if (!socket) {
      return initializeSocket();
   }
   return socket;
};

export const disconnectSocket = () => {
   if (socket) {
      socket.disconnect();
      socket = null;
   }
};
