import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema<{ participants: string[] }>({
   participants: [String], // for userID
});

export const ChatRoomModel = mongoose.model("ChatRoom", chatRoomSchema);
