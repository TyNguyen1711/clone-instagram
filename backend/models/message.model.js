import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reveived: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: [
    {
      type: {
        type: String,
        enum: ["text", "image", "video", "audio"],
        required: true,
      },
      data: {
        type: String,
        required: true,
      },
    },
  ],
});
export const Message = mongoose.model("Message", messageSchema);
