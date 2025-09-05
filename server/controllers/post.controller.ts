import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post.model";
import { z } from "zod";
import { catchAsyncError } from "../utils/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "../utils/cloudinary";
import mongoose from "mongoose";

const postSchema = z.object({
    content: z.string().min(1, "Post content is required"),
});

export const createPost = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.user) {
                req.body = { ...req.body, userId: req.user.id, username: req.user.username, avatar: req.user.avatar }
            }
            const parseResult = postSchema.safeParse(req.body);
            if (!parseResult.success) {
                const issues = parseResult.error.issues.map((e) => e.path.join("."));
                return next(new ErrorHandler(issues.join(", "), 400));
            }

            const { content } = parseResult.data;

            let media: { url: string; public_id: string }[] = [];
            if (req.files && req.files.media) {
                const files = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
                media = await Promise.all(
                    files.map(async (file: any) => {
                        const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "posts" });
                        return { url: result.secure_url, public_id: result.public_id };
                    })
                );
            }

            const post = await Post.create({
                author: { userId: req.user?.id, username: req.user?.username, avatar: req.user?.avatar },
                content,
                media,
            });

            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const deletePost = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params;
            const userId = req.user?.id;

            if (!mongoose.Types.ObjectId.isValid(postId)) return next(new ErrorHandler("Invalid Post ID", 400));

            const post = await Post.findById(postId);
            if (!post) return next(new ErrorHandler("Post not found", 404));
            if (post.author.userId.toString() !== userId) return next(new ErrorHandler("Unauthorized", 403));

            if (post.media && post.media.length > 0) {
                await Promise.all(post.media.map((m) => cloudinary.uploader.destroy(m.public_id)));
            }

            post.deleted = true;
            await post.save();

            res.status(200).json({ success: true, message: "Post deleted successfully" });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const updatePost = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params;
            const userId = req?.user?.id;
            const { content, previousFiles } = req.body;

            if (!mongoose.Types.ObjectId.isValid(postId)) return next(new ErrorHandler("Invalid Post ID", 400));

            const post = await Post.findById(postId);
            if (!post) return next(new ErrorHandler("Post not found", 404));
            if (post.author.userId.toString() !== userId) return next(new ErrorHandler("Unauthorized", 403));

            const keepIds: string[] = Array.isArray(previousFiles) ? previousFiles : [];
            const mediaToKeep = post.media?.filter((m) => keepIds.includes(m.public_id)) || [];
            const mediaToDelete = post.media?.filter((m) => !keepIds.includes(m.public_id)) || [];

            if (mediaToDelete.length > 0) {
                await Promise.all(mediaToDelete.map((m) => cloudinary.uploader.destroy(m.public_id)));
            }

            let newUploads: { url: string; public_id: string }[] = [];
            if (req.files && req.files.media) {
                const files = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
                newUploads = await Promise.all(
                    files.map(async (file: any) => {
                        const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "posts" });
                        return { url: result.secure_url, public_id: result.public_id };
                    })
                );
            }

            post.content = content || post.content;
            post.media = [...mediaToKeep, ...newUploads];

            await post.save();

            res.status(200).json({
                success: true,
                message: "Post updated successfully",
                post,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
