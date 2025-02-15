import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    mentions: [
      {
        username: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        indices: [Number],
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Comment = mongoose.model("Comment", commentSchema);
