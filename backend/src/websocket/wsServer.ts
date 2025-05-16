// websocket/wsServer.ts
import { Server } from "socket.io";
import http from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import ChatRoom from "../models/chatRoom.model";
import Message from "../models/chatMessage.model";
import mongoose from "mongoose";
import cookie from "cookie";

// Map to track active connections
const connectedUsers = new Map();

export default function initializeSocket(server: http.Server) {
   const io = new Server(server, {
      cors: {
         origin: process.env.FRONTEND_URL || "http://localhost:5173",
         methods: ["GET", "POST"],
         credentials: true,
      },
   });

   // Authentication middleware
   io.use((socket, next) => {
      try {
         const { cookie: cookieHeader } = socket.handshake.headers;

         if (!cookieHeader) {
            console.log("No cookies found in request");
            return next(new Error("Authentication required"));
         }

         const cookies = cookie.parse(cookieHeader);
         const token = cookies["auth_token"]; // or whatever cookie name you use

         if (!token) {
            console.log("No auth token found in cookies");
            return next(new Error("Authentication required"));
         }

         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
         socket.data.userId = (decoded as JwtPayload).userId;
         next();
      } catch (error) {
         console.error("Socket authentication error:", error);
         next(new Error("Authentication failed"));
      }
   });

   io.on("connection", (socket) => {
      try {
         const userId = socket.data.userId;
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

               if (!receiverId || !content) {
                  socket.emit("error", { message: "Missing required message data" });
                  return;
               }

               console.log(`Message from ${senderId} to ${receiverId}: ${content}`);

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
               chatRoom.lastMessage =
                  newMessage._id as unknown as mongoose.Types.ObjectId;
               await chatRoom.save();

               // Get populated message to send to client
               const populatedMessage = await Message.findById(newMessage._id)
                  .populate("sender", "_id firstName lastName")
                  .populate("receiver", "_id firstName lastName");

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

               if (!messageIds || !Array.isArray(messageIds)) {
                  socket.emit("error", { message: "Invalid message IDs" });
                  return;
               }

               await Message.updateMany(
                  { _id: { $in: messageIds } },
                  { $set: { read: true } }
               );

               socket.emit("messages-marked-read", { messageIds });
            } catch (error) {
               console.error("Error marking messages as read:", error);
               socket.emit("error", { message: "Failed to mark messages as read" });
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
      } catch (error) {
         console.error("Error in socket connection:", error);
      }
   });

   return io;
}
