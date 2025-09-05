import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStory extends Document {
  user: {
    userId: Types.ObjectId;
    username: string;
    avatar?: string;
  };
  media: string;
  expiresAt: Date;
  createdAt: Date;
}

const StorySchema = new Schema<IStory>({
  user: {
    userId: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    avatar: { type: String }
  },
  media: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export const Story = mongoose.model<IStory>("Story", StorySchema);
