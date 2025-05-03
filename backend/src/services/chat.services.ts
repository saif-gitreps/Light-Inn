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

export const getChatRoomsByUserId = async (userId: string): Promise<ChatRoomType[]> => {
   return await ChatRoom.find({ participants: userId })
      .populate("lastMessage")
      .populate("participants", "username email")
      .sort({ updatedAt: -1 })
      .exec();
};

export const getChatRoomMessages = async (
   chatRoomId: string,
   limit: number = 50,
   offset: number = 50
): Promise<ChatMessageType[]> => {
   return await ChatMessage.find({ chatRoomId })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .populate("sender", "username")
      .exec();
};

export const saveMessage = async (
   chatRoomId: string,
   senderId: string,
   content: string
): Promise<ChatMessageType> => {
   const message = new ChatMessage({
      chatRoomId,
      sender: senderId,

      content,
      timestamp: new Date(),
   });

   return await message.save();
};
