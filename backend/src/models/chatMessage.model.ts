import mongoose, { Schema, Document } from "mongoose";
import { ChatMessage } from "../shared/types";
import ChatRoom from "./chatRoom.model";

const ChatMessageSchema = new Schema({
   chatRoomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
   sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
   content: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
});

// Index for quick retrieval of messages by chat room
ChatMessageSchema.index({ chatRoomId: 1, timestamp: 1 });

// Update the last message in the chat room after saving a new message
ChatMessageSchema.post("save", async function (doc) {
   await ChatRoom.findByIdAndUpdate(doc.chatRoomId, {
      lastMessage: doc._id,
      updatedAt: Date.now(),
   });
});

export default mongoose.model<ChatMessage & Document>("ChatMessage", ChatMessageSchema);
