import mongoose, { Document, Schema } from "mongoose";

export interface IChatRoom extends Document {
   participants: mongoose.Types.ObjectId[];
   lastMessage?: mongoose.Types.ObjectId;
   lastActivity: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
   participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
   lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
   lastActivity: { type: Date, default: Date.now },
});

// Create a compound index to ensure unique chat rooms between two users
chatRoomSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
