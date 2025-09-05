import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILike {
  userId: Types.ObjectId;
  username: string;
  avatar?: string;
  createdAt: Date;
}

export interface IComment {
  commentId: Types.ObjectId;
  user: {
    userId: Types.ObjectId;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: ILike[];
  replies?: IComment[];
  createdAt: Date;
}

export interface IMedia {
  url: string;
  public_id: string;
}

export interface IPost extends Document {
  author: {
    userId: Types.ObjectId;
    username: string;
    avatar?: string;
  };
  content: string;
  media?: IMedia[];
  likes: ILike[];
  comments: IComment[];
  views: number;
  deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LikeSchema = new Schema<ILike>({
  userId: { type: Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new Schema<IComment>({
  commentId: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  user: {
    userId: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
  },
  content: { type: String, required: true },
  likes: { type: [LikeSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.add({
  replies: { type: [CommentSchema], default: [] },
});

const MediaSchema = new Schema<IMedia>({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const PostSchema = new Schema<IPost>(
  {
    author: {
      userId: { type: Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      avatar: { type: String },
    },
    content: { type: String, required: true },
    media: { type: [MediaSchema], default: [] },
    likes: { type: [LikeSchema], default: [] },
    comments: { type: [CommentSchema], default: [] },
    views: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
