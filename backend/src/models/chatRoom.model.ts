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
// chatRoomSchema.index({ participants: 1 }, { unique: true });

// chatRoomSchema.pre("save", function (next) {
//    // Sort the participant IDs to ensure consistent ordering
//    this.participants.sort();
//    next();
// });

chatRoomSchema.index(
   {
      "participants.0": 1,
      "participants.1": 1,
   },
   {
      unique: true,
      // Only apply this index when there are exactly 2 participants (for direct messages)
      partialFilterExpression: {
         "participants.1": { $exists: true },
         "participants.2": { $exists: false },
      },
   }
);

// Add a pre-save hook to ensure participants are sorted for direct messages
chatRoomSchema.pre("save", function (next) {
   if (this.participants.length === 2) {
      // Convert ObjectId to strings for sorting
      const participantStrings = this.participants.map((p) => p.toString());
      participantStrings.sort();

      // Convert strings back to ObjectIds
      this.participants = participantStrings.map((p) => new mongoose.Types.ObjectId(p));
   }
   next();
});

export default mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
