import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISocketClient extends Document {
  userId: Types.ObjectId;
  socketId: string;
  connectedAt: Date;
}

const SocketClientSchema = new Schema<ISocketClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    socketId: { type: String, required: true },
    connectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SocketClient = mongoose.model<ISocketClient>("SocketClient", SocketClientSchema);
