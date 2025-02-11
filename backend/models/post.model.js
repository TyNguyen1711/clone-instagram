import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  srcURL: {
    type: String,
    default: "",
    require: true,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    require: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

export const Post = mongoose.model("Post", postSchema);
