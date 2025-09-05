import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType = 
  | "like" 
  | "comment" 
  | "follow" 
  | "mention";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender: {
    userId: Types.ObjectId;
    username: string;
    avatar?: string;
  };
  type: NotificationType;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: {
      userId: { type: Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      avatar: { type: String },
    },
    type: { type: String, enum: ["like", "comment", "follow", "mention"], required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
