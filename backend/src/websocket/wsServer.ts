import { Server as HttpServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import url, { URL } from "url";

// map to store active connections
const clients = new Map<string, WebSocket>();

// map to store which chat room a user is connected to
const userRooms = new Map<string, Set<string>>();

export default function setUpWebSocketServer(server: HttpServer) {
   const wss = new WebSocketServer({ noServer: true });

   // handle the upgrade from HTTP to WebSocket
   server.on("upgrade", async (request, socket, head) => {
      const reqUrl = new URL(request.url || "");
      const pathname = reqUrl.pathname;

      const params = new URLSearchParams(reqUrl.search);

      if (pathname === "/ws") {
         const token = params.get("token");

         if (!token) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();

            return;
         }

         try {
            const user = await verifyTokenForWebSocket(token);

            // storing user info on the request for later use
            (request as any).user = user;
            wss.handleUpgrade(request, socket, head, (ws) => {
               wss.emit("connection", ws, request);
            });
         } catch (error) {
            console.error("WebSocket authentication error:", error);
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
         }
      } else {
         socket.destroy();
      }
   });

   // handle new websocket connnections

   wss.on("connection", (ws, request) => {
      const user = (request as any).user;
      const userId = user._id.toString();

      console.log(`User ${userId} connected to WS`);

      // store the connection
      clients.set(userId, ws);

      // initialize a user's room if it does not exists.
      if (!userRooms.has(userId)) {
         userRooms.set(userId, new Set());
      }

      // send a hello msg

      ws.send(
         JSON.stringify({
            type: "conntected_established",
            payload: {
               message: "Connected to chat server",
            },
         })
      );

      // Handle incoming messages
      ws.on("message", async (message: string) => {
         try {
            const parsedMessage: WSMessage = JSON.parse(message);

            switch (parsedMessage.type) {
               case "message":
                  await handleChatMessage(userId, parsedMessage.payload);
                  break;

               case "join_room":
                  await handleJoinRoom(userId, parsedMessage.payload.roomId);
                  break;

               case "leave_room":
                  await handleLeaveRoom(userId, parsedMessage.payload.roomId);
                  break;

               case "typing":
                  await handleTypingStatus(userId, parsedMessage.payload);
                  break;

               case "read":
                  await handleReadStatus(userId, parsedMessage.payload);
                  break;

               default:
                  console.warn(`Unknown message type: ${parsedMessage.type}`);
            }
         } catch (err) {
            console.error("Error processing WebSocket message:", err);
            ws.send(
               JSON.stringify({
                  type: "error",
                  payload: { message: "Failed to process message" },
               })
            );
         }
      });

      // Handle disconnection
      ws.on("close", () => {
         console.log(`User ${userId} disconnected from WebSocket`);

         // Clean up the connection
         clients.delete(userId);
         userRooms.delete(userId);
      });
   });

   async function handleChatMessage(userId: string, payload: any) {
      const { roomId, content } = payload;

      // Save the message to the database
      const message = await saveMessage(roomId, userId, content);

      // Get the room to find participants
      const room = await require("../models/ChatRoom").findById(roomId);

      if (!room) {
         return;
      }

      // Broadcast the message to all participants in the room
      const messageToSend = {
         type: "new_message",
         payload: {
            messageId: message._id,
            roomId: roomId,
            sender: userId,
            content: content,
            timestamp: message.timestamp,
         },
      };

      // Send to all participants except sender
      room.participants.forEach((participantId: string) => {
         const participantIdStr = participantId.toString();
         if (participantIdStr !== userId && clients.has(participantIdStr)) {
            const client = clients.get(participantIdStr);
            client?.send(JSON.stringify(messageToSend));
         }
      });
   }

   async function handleJoinRoom(userId: string, roomId: string) {
      // Add the room to the user's set of rooms
      const userRoomSet = userRooms.get(userId);
      if (userRoomSet) {
         userRoomSet.add(roomId);
      }

      // Get recent messages
      const messages = await getChatRoomMessages(roomId, 50);

      // Send room history to the user
      const client = clients.get(userId);
      if (client) {
         client.send(
            JSON.stringify({
               type: "room_history",
               payload: {
                  roomId,
                  messages,
               },
            })
         );
      }
   }

   async function handleLeaveRoom(userId: string, roomId: string) {
      // Remove the room from the user's set of rooms
      const userRoomSet = userRooms.get(userId);
      if (userRoomSet) {
         userRoomSet.delete(roomId);
      }
   }

   async function handleTypingStatus(userId: string, payload: any) {
      const { roomId, isTyping } = payload;

      // Get the room to find participants
      const room = await require("../models/ChatRoom").findById(roomId);

      if (!room) {
         return;
      }

      // Notify other participants about typing status
      const statusMessage = {
         type: "typing_status",
         payload: {
            roomId,
            userId,
            isTyping,
         },
      };

      // Send to all participants except sender
      room.participants.forEach((participantId: string) => {
         const participantIdStr = participantId.toString();
         if (participantIdStr !== userId && clients.has(participantIdStr)) {
            const client = clients.get(participantIdStr);
            client?.send(JSON.stringify(statusMessage));
         }
      });
   }

   async function handleReadStatus(userId: string, payload: any) {
      const { roomId, messageId } = payload;

      // Implement read receipt logic here if needed
      // This is a placeholder for message read status functionality
   }

   return wss;
}
