import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import ChatRoom from "../models/chatRoom.model";
import Message from "../models/chatMessage.model";
import mongoose from "mongoose";
import cookie from "cookie";

// Map to track active connections
const connectedUsers = new Map();

export default function initializeSocket(server: http.Server) {
   const io = new Server(server, {
      cors: {
         origin: process.env.FRONTEND_URL || "http://localhost:5173", // Your Vite React app's URL
         methods: ["GET", "POST"],
         credentials: true,
      },
   });

   // Authentication middleware
   io.use((socket, next) => {
      const { cookie: cookieHeader } = socket.handshake.headers;

      if (!cookieHeader) {
         return next(new Error("No cookies found"));
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies["auth_token"]; // or whatever cookie name you use

      if (!token) {
         return next(new Error("Authentication error"));
      }

      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         socket.data.user = decoded;
         next();
      } catch (error) {
         next(new Error("Authentication error"));
      }
   });

   io.on("connection", (socket) => {
      const userId = socket.data.user.id;
      console.log(`User connected: ${userId}`);

      // Store the socket connection for this user
      connectedUsers.set(userId, socket.id);

      // Join user to their private room
      socket.join(userId);

      // Listen for private messages
      socket.on("private-message", async (data) => {
         try {
            const { receiverId, content } = data;
            const senderId = userId;

            // Find or create chat room
            let chatRoom = await ChatRoom.findOne({
               participants: { $all: [senderId, receiverId] },
            });

            if (!chatRoom) {
               chatRoom = await ChatRoom.create({
                  participants: [senderId, receiverId],
                  lastActivity: new Date(),
               });
            } else {
               chatRoom.lastActivity = new Date();
            }

            // Create and save the message
            const newMessage = await Message.create({
               sender: senderId,
               receiver: receiverId,
               content,
               timestamp: new Date(),
               read: false,
            });

            // Update chatroom with last message
            chatRoom.lastMessage = newMessage._id as unknown as mongoose.Types.ObjectId;
            await chatRoom.save();

            // Get populated message to send to client
            const populatedMessage = await Message.findById(newMessage._id)
               .populate("sender", "name avatar")
               .populate("receiver", "name avatar");

            // Send to the receiver if they are online
            if (connectedUsers.has(receiverId)) {
               io.to(receiverId).emit("private-message", populatedMessage);
            }

            // Send back to the sender
            socket.emit("private-message", populatedMessage);
         } catch (error) {
            console.error("Error handling message:", error);
            socket.emit("error", { message: "Failed to send message" });
         }
      });

      // Mark messages as read
      socket.on("mark-read", async (data) => {
         try {
            const { messageIds } = data;
            await Message.updateMany(
               { _id: { $in: messageIds } },
               { $set: { read: true } }
            );
            socket.emit("messages-marked-read", { messageIds });
         } catch (error) {
            console.error("Error marking messages as read:", error);
         }
      });

      // User typing indicator
      socket.on("typing", (data) => {
         const { receiverId } = data;
         if (connectedUsers.has(receiverId)) {
            io.to(receiverId).emit("typing", { userId });
         }
      });

      // User stops typing
      socket.on("stop-typing", (data) => {
         const { receiverId } = data;
         if (connectedUsers.has(receiverId)) {
            io.to(receiverId).emit("stop-typing", { userId });
         }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
         console.log(`User disconnected: ${userId}`);
         connectedUsers.delete(userId);
      });
   });

   return io;
}
