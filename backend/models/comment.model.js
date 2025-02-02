import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
export default Comment = mongoose.model("Comment", commentSchema);
