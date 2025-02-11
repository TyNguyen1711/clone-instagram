import sharp from "sharp";
import { Post } from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";

import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    console.log("test: ", post);
    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    throw error;
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(401).json({
        success: false,
        mes: "Post not found",
      });
    }
    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();
    const userLike = await User.find({ _id: userId }).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (userLike !== postOwnerId) {
      const notification = {
        type: "like",
        userId: userId,
        userDetail: userLike,
        postId: postId,
        message: "Your post was liked",
      };
      const postSocketId = getReceiverSocketId(postOwnerId);
      io.to(postSocketId).emit("notification", notification);
    }
    return res.status(200).json({
      success: true,
      message: "post liked successfully",
    });
  } catch (error) {
    throw error;
  }
};
export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(401).json({
        success: false,
        mes: "Post not found",
      });
    }
    await post.updateOne({ $pull: { likes: userId } });
    await post.save();
    const userDislike = await User.find({ _id: userId }).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (userDislike !== postOwnerId) {
      const notification = {
        type: "dislike",
        userId: userId,
        userDetail: userDislike,
        postId: postId,
        message: "Your post was disliked",
      };
      const postSocketId = getReceiverSocketId(postOwnerId);
      io.to(postSocketId).emit("notification", notification);
    }
    return res.status(200).json({
      success: true,
      message: "post disliked successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ success: false, mes: "Content is required" });
    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({
      message: "Comment added",
      success: true,
      comment,
    });
  } catch (error) {
    throw error;
  }
};

export const getCommentsPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username, profilePicture"
    );
    if (!comments) {
      return res.status(404).json({
        success: false,
        mes: "Comment not found",
      });
    }
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (req, res) => {
  try {
    const authorId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        mes: "Post not found",
      });
    }
    if (post.author.toString() !== authorId) {
      return res.status(400).json({
        success: false,
        mes: "Unauthorized",
      });
    }
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      success: true,
      mes: "Post deleted",
    });
  } catch (error) {
    throw error;
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        mes: "Post not found",
      });
    }
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        success: true,
        type: "unsave",
        mes: "Post bookmark",
      });
    } else {
      await user.updateOne({ $push: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        success: true,
        type: "save",
        mes: "Remove bookmark",
      });
    }
  } catch (error) {
    throw error;
  }
};
