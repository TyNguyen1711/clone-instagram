import { toast } from "sonner";
import axios from "../axios.js";
export const likeOrDislikeComment = async (commentId) => {
  try {
    const response = await axios.post("/comment/like-or-dislike", {
      commentId,
    });
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};
