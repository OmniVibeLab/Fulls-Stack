import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post.model";
import { Notification } from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";

// Dislike a post
export const dislikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const { userId, username, avatar, fullName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) return next(new ErrorHandler("Invalid Post ID", 400));

    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    post.likes = post.likes.filter(like => like.userId.toString() !== userId);
    await post.save();

    // Send notification to post author
    if (post.author.userId.toString() !== userId) {
      await Notification.create({
        userId: post.author.userId,
        sender: { userId, username, avatar, fullName },
        type: "dislike",
        link: `/posts/${postId}`,
        createdAt: new Date(),
      });
    }

    res.status(200).json({ success: true, message: "Post disliked", post });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Add comment
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const { userId, username, avatar, fullName, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) return next(new ErrorHandler("Invalid Post ID", 400));
    if (!content?.trim()) return next(new ErrorHandler("Comment content is required", 400));

    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    const newComment = {
      commentId: new mongoose.Types.ObjectId(),
      user: { userId, username, avatar, fullName },
      content,
      likes: [],
      replies: [],
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    if (post.author.userId.toString() !== userId) {
      await Notification.create({
        userId: post.author.userId,
        sender: { userId, username, avatar, fullName },
        type: "comment",
        link: `/posts/${postId}`,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ success: true, message: "Comment added", comment: newComment });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Reply to comment
export const replyToComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, username, avatar, fullName, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId))
      return next(new ErrorHandler("Invalid ID", 400));
    if (!content?.trim()) return next(new ErrorHandler("Reply content is required", 400));

    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    const comment = post.comments.find(c => c.commentId.toString() === commentId);
    if (!comment) return next(new ErrorHandler("Comment not found", 404));

    const reply = {
      commentId: new mongoose.Types.ObjectId(),
      user: { userId, username, avatar, fullName },
      content,
      likes: [],
      replies: [],
      createdAt: new Date(),
    };

    comment.replies?.push(reply);
    await post.save();

    if (comment.user.userId.toString() !== userId) {
      await Notification.create({
        userId: comment.user.userId,
        sender: { userId, username, avatar, fullName },
        type: "reply",
        link: `/posts/${postId}`,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ success: true, message: "Reply added", reply });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Like/Dislike comment or reply
export const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId, username, avatar, fullName, action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId))
      return next(new ErrorHandler("Invalid ID", 400));

    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    const comment = post.comments.find(c => c.commentId.toString() === commentId);
    if (!comment) return next(new ErrorHandler("Comment not found", 404));

    let targetLikes = comment.likes;
    let notifyUserId = comment.user.userId;

    // If replying to a comment
    if (replyId) {
      const reply = comment.replies?.find(r => r.commentId.toString() === replyId);
      if (!reply) return next(new ErrorHandler("Reply not found", 404));
      targetLikes = reply.likes;
      notifyUserId = reply.user.userId;
    }

    if (action === "like") {
      if (!targetLikes.some(like => like.userId.toString() === userId)) {
        targetLikes.push({ userId, username, avatar, createdAt: new Date() });
        // Send notification
        if (notifyUserId.toString() !== userId) {
          await Notification.create({
            userId: notifyUserId,
            sender: { userId, username, avatar, fullName },
            type: "like",
            link: `/posts/${postId}`,
            createdAt: new Date(),
          });
        }
      }
    } else if (action === "dislike") {
      targetLikes = targetLikes.filter(like => like.userId.toString() !== userId);
    } else {
      return next(new ErrorHandler("Invalid action", 400));
    }

    if (replyId) {
      const reply = comment.replies!.find(r => r.commentId.toString() === replyId)!;
      reply.likes = targetLikes;
    } else {
      comment.likes = targetLikes;
    }

    await post.save();
    res.status(200).json({ success: true, message: `Comment ${action}d`, comment });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new ErrorHandler("Invalid ID", 400));
    }

    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    const commentIndex = post.comments.findIndex(c => c.commentId.toString() === commentId);
    if (commentIndex === -1) return next(new ErrorHandler("Comment not found", 404));

    const comment = post.comments[commentIndex];

    if (comment.user.userId.toString() !== userId) {
      return next(new ErrorHandler("Unauthorized to delete this comment", 403));
    }

    // Delete main comment along with all replies
    post.comments.splice(commentIndex, 1);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment and all its replies deleted successfully",
      post,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};
export const deleteCommentReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(replyId)) {
      return next(new ErrorHandler("Invalid ID", 400));
    }

    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    const comment = post.comments.find(c => c.commentId.toString() === commentId);
    if (!comment) return next(new ErrorHandler("Comment not found", 404));

    const replyIndex = comment.replies?.findIndex(r => r.commentId.toString() === replyId);
    if (replyIndex === undefined || replyIndex === -1) return next(new ErrorHandler("Reply not found", 404));

    const reply = comment.replies![replyIndex];

    if (reply.user.userId.toString() !== userId) {
      return next(new ErrorHandler("Unauthorized to delete this reply", 403));
    }

    comment.replies!.splice(replyIndex, 1);
    await post.save();

    res.status(200).json({ success: true, message: "Reply deleted successfully", post });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};