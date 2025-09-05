import { Router } from "express";
import { createPost, deletePost, updatePost } from "../controllers/post.controller";
import { addComment, deleteComment, deleteCommentReply, dislikePost, likeComment, replyToComment } from "../controllers/user.controller";

const router = Router()

router.post("/", createPost)
router.put("/update/:postId", updatePost)
router.delete("/delete/:postId", deletePost)
router.put('/:postId/dislike', dislikePost);
router.post('/:postId/comments', addComment);
router.post('/:postId/comments/:commentId/replies', replyToComment);
router.put('/:postId/comments/:commentId/like', likeComment);
router.delete('/:postId/comments/:commentId', deleteComment);
router.delete('/:postId/comments/:commentId/replies/:replyId', deleteCommentReply);

export default router