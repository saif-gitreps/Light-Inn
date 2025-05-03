import ChatRoom from "../models/chatRoom.model";
import ChatMessage from "../models/chatMessage.model";
import {
   ChatMessage as ChatMessageType,
   ChatRoom as ChatRoomType,
} from "../shared/types";
import mongoose from "mongoose";

export const createChatRoom = async (
   user1Id: string,
   user2Id: string
): Promise<ChatRoomType> => {
   const existingRoom = await ChatRoom.findOne({
      participants: { $all: [user1Id, user2Id], $size: 2 },
   }).exec();

   if (existingRoom) {
      return existingRoom;
   }

   const newRoom = new ChatRoom({
      participants: [user1Id, user2Id],
      createdAt: new Date(),
      updatedAt: new Date(),
   });

   return newRoom.save();
};
