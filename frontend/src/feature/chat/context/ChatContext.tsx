import React, {
   createContext,
   useContext,
   useState,
   useEffect,
   useCallback,
   ReactNode,
} from "react";
import { ChatRoom, ChatMessage, User, WSMessage } from "../../../lib/shared-types";
import useWebSocket from "../hooks/useWebSocket";
import { getChatRooms, getChatMessages, createChatRoom } from "../api/chat";

const getWebSocketUrl = () => {
   const isProduction = import.meta.env.PROD;
   const host = import.meta.env.VITE_API_HOST || window.location.host;
   const protocol =
      isProduction || window.location.protocol === "https:" ? "wss:" : "ws:";
   return `${protocol}//${host}/ws`;
};

interface ChatContextType {
   rooms: ChatRoom[];
   activeRoom: ChatRoom | null;
   messages: Record<string, ChatMessage[]>;
   loading: boolean;
   typingUsers: Record<string, string[]>;
   sendMessage: (roomId: string, content: string) => void;
   setActiveRoom: (roomId: string) => void;
   startNewChat: (userId: string) => Promise<ChatRoom>;
   setTypingStatus: (roomId: string, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode; currentUser: User }> = ({
   children,
   currentUser,
}) => {
   const [rooms, setRooms] = useState<ChatRoom[]>([]);
   const [activeRoom, setActiveRoomState] = useState<ChatRoom | null>(null);
   const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
   const [loading, setLoading] = useState<boolean>(true);
   const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
   const url = getWebSocketUrl();

   // Initialize WebSocket connection
   const { sendMessage: wsSendMessage, lastMessage } = useWebSocket(url);

   // Load chat rooms on mount
   useEffect(() => {
      const loadRooms = async () => {
         try {
            const fetchedRooms = await getChatRooms();
            setRooms(fetchedRooms);
            setLoading(false);
         } catch (error) {
            console.error("Failed to load chat rooms:", error);
            setLoading(false);
         }
      };

      if (currentUser) {
         loadRooms();
      }
   }, [currentUser]);

   // Handle incoming WebSocket messages
   useEffect(() => {
      if (lastMessage) {
         try {
            const parsedMessage: WSMessage = JSON.parse(lastMessage.data);

            switch (parsedMessage.type) {
               case "new_message":
                  handleNewMessage(parsedMessage.payload);
                  break;

               case "room_history":
                  handleRoomHistory(parsedMessage.payload);
                  break;

               case "typing_status":
                  handleTypingStatus(parsedMessage.payload);
                  break;

               default:
                  console.log("Unhandled message type:", parsedMessage.type);
            }
         } catch (error) {
            console.error("Error processing WebSocket message:", error);
         }
      }
   }, [lastMessage]);

   // Handle new messages from WebSocket
   const handleNewMessage = (payload: any) => {
      const { roomId, messageId, sender, content, timestamp } = payload;

      const newMessage: ChatMessage = {
         _id: messageId,
         chatRoomId: roomId,
         sender,
         content,
         timestamp: new Date(timestamp),
         status: "delivered",
      };

      setMessages((prevMessages) => {
         const roomMessages = [...(prevMessages[roomId] || [])];
         roomMessages.push(newMessage);
         return {
            ...prevMessages,
            [roomId]: roomMessages,
         };
      });

      // Update the last message in the room
      setRooms((prevRooms) =>
         prevRooms
            .map((room) =>
               room._id === roomId
                  ? { ...room, lastMessage: newMessage, updatedAt: new Date() }
                  : room
            )
            .sort(
               (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
      );
   };

   // Handle room history from WebSocket
   const handleRoomHistory = (payload: any) => {
      const { roomId, messages: roomMessages } = payload;

      setMessages((prevMessages) => ({
         ...prevMessages,
         [roomId]: roomMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
         })),
      }));
   };

   // Handle typing status from WebSocket
   const handleTypingStatus = (payload: any) => {
      const { roomId, userId, isTyping } = payload;

      setTypingUsers((prev) => {
         const usersTyping = [...(prev[roomId] || [])];

         if (isTyping && !usersTyping.includes(userId)) {
            usersTyping.push(userId);
         } else if (!isTyping) {
            const index = usersTyping.indexOf(userId);
            if (index !== -1) {
               usersTyping.splice(index, 1);
            }
         }

         return {
            ...prev,
            [roomId]: usersTyping,
         };
      });
   };

   // Set active room and load messages if needed
   const setActiveRoom = useCallback(
      async (roomId: string) => {
         const room = rooms.find((r) => r._id === roomId);

         if (room) {
            setActiveRoomState(room);

            // Join the room via WebSocket
            wsSendMessage(
               JSON.stringify({
                  type: "join_room",
                  payload: { roomId },
               })
            );

            // If we don't have messages for this room yet, load them from API
            if (!messages[roomId]) {
               try {
                  const roomMessages = await getChatMessages(roomId);
                  setMessages((prev) => ({
                     ...prev,
                     [roomId]: roomMessages.map((msg) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                     })),
                  }));
               } catch (error) {
                  console.error("Failed to load messages:", error);
               }
            }
         }
      },
      [rooms, messages, wsSendMessage]
   );

   // Send a new message
   const sendMessage = useCallback(
      (roomId: string, content: string) => {
         if (!content.trim()) return;

         // Create a temporary message object for optimistic UI update
         const tempId = `temp-${Date.now()}`;
         const newMessage: ChatMessage = {
            _id: tempId,
            chatRoomId: roomId,
            sender: currentUser,
            content,
            timestamp: new Date(),
            status: "sent",
         };

         // Update UI optimistically
         setMessages((prev) => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), newMessage],
         }));

         // Update the last message in the room
         setRooms((prevRooms) =>
            prevRooms
               .map((room) =>
                  room._id === roomId
                     ? { ...room, lastMessage: newMessage, updatedAt: new Date() }
                     : room
               )
               .sort(
                  (a, b) =>
                     new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
               )
         );

         // Send via WebSocket
         wsSendMessage(
            JSON.stringify({
               type: "message",
               payload: {
                  roomId,
                  content,
               },
            })
         );

         // Clear typing status after sending a message
         setTypingStatus(roomId, false);
      },
      [currentUser, wsSendMessage]
   );

   // Start a new chat with a user
   const startNewChat = useCallback(
      async (userId: string) => {
         try {
            const newRoom = await createChatRoom(userId);

            // Add the new room to the list
            setRooms((prev) => [newRoom, ...prev]);

            // Set it as active
            setActiveRoomState(newRoom);

            // Join the room via WebSocket
            wsSendMessage(
               JSON.stringify({
                  type: "join_room",
                  payload: { roomId: newRoom._id },
               })
            );

            return newRoom;
         } catch (error) {
            console.error("Failed to create chat room:", error);
            throw error;
         }
      },
      [wsSendMessage]
   );

   // Set typing status
   const setTypingStatus = useCallback(
      (roomId: string, isTyping: boolean) => {
         wsSendMessage(
            JSON.stringify({
               type: "typing",
               payload: {
                  roomId,
                  isTyping,
               },
            })
         );
      },
      [wsSendMessage]
   );

   return (
      <ChatContext.Provider
         value={{
            rooms,
            activeRoom,
            messages,
            loading,
            typingUsers,
            sendMessage,
            setActiveRoom,
            startNewChat,
            setTypingStatus,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
};

export const useChat = () => {
   const context = useContext(ChatContext);
   if (context === undefined) {
      throw new Error("useChat must be used within a ChatProvider");
   }
   return context;
};
