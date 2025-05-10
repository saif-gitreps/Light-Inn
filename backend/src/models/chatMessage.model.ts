import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
   sender: mongoose.Types.ObjectId;
   receiver: mongoose.Types.ObjectId;
   content: string;
   timestamp: Date;
   read: boolean;
}

const messageSchema = new Schema<IMessage>({
   sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
   receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
   content: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
   read: { type: Boolean, default: false },
});

export default mongoose.model<IMessage>("Message", messageSchema);
