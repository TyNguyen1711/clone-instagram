import { Comment } from "../models/comment.model.js";
import { Message } from "../models/message.model.js";
import { Post } from "../models/post.model.js";
export const likeOrDislikeComment = async (req, res) => {
  try {
    const userId = req.id;
    const commentId = req.body.commentId;
    const comment = await Comment.findOne({ _id: commentId });
    let type;
    if (comment.likes.includes(userId)) {
      type = "dislike";
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== userId
      );
      await comment.save();
    } else {
      type = "like";
      comment.likes = [userId, ...comment.likes];
      await comment.save();
    }
    return res.status(200).json({
      success: true,
      type,
      comment,
    });
  } catch (error) {
    throw error;
  }
};

export const replyComment = async (req, res) => {
    try {
      const { originalCommentId, text } = req.body;
      const userId = req.id;
  
      // Kiểm tra nếu thiếu dữ liệu
      if (!originalCommentId || !text) {
        return res.status(400).json({ success: false, message: "Missing data" });
      }
  
      const commentOriginal = await Comment.findById(originalCommentId);
      if (!commentOriginal) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }
  
      // Tạo reply
      const comment = await Comment.create({
        text,
        author: userId,
        post: commentOriginal.post,
      });
  
      // Populate author để trả về đầy đủ thông tin
      await comment.populate("author", "username profilePicture");
  
      // Thêm comment vào danh sách replies
      commentOriginal.replies.unshift(comment._id);
      await commentOriginal.save();
  
      // Trả về dữ liệu
      return res.status(201).json({
        success: true,
        message: "Reply added successfully",
        comment,
      });
    } catch (error) {
      console.error("Error replying to comment:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  