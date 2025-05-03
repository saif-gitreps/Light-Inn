import mongoose, { Schema, Document } from "mongoose";
import { ChatRoom } from "../shared/types";

const ChatRoomSchema = new Schema({
   participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
   lastMessage: { type: Schema.Types.ObjectId, ref: "ChatMessage" },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

// Index for quick lookup of chat rooms by participants
ChatRoomSchema.index({ participants: 1 });

// Method to find a chat room between two users
ChatRoomSchema.statics.findByParticipants = async function (
   user1Id: string,
   user2Id: string
) {
   return await this.findOne({
      participants: { $all: [user1Id, user2Id], $size: 2 },
   });
};

export default mongoose.model<ChatRoom & Document>("ChatRoom", ChatRoomSchema);
