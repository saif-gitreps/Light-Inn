import mongoose from "mongoose";
import { ChatMessageType } from "../shared/types";

const chatMessageSchema = new mongoose.Schema<ChatMessageType>({
   text: String,
   senderId: String,
   recipientId: String,
   chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
   isRead: { type: Boolean, default: false },
   createdAt: { type: Date, default: Date.now },
});

export const ChatMessageModel = mongoose.model("ChatMessage", chatMessageSchema);
