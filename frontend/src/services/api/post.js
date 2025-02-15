import { toast } from "sonner";
import axios from "../axios.js";
export const createPostApi = async (data) => {
  try {
    const response = await axios.post("/post/addpost", data);
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const getAllPost = async () => {
  try {
    const response = await axios.get("/post/all");
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};
export const deletePostApi = async (postId) => {
  try {
    const response = await axios.post(`/post/delete/${postId}`, {});
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const likeOrDislikeHandler = async (postId, action) => {
  try {
    const response = await axios.get(`/post/${postId}/${action}`);
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const commentPostApi = async (postId, payload) => {
  try {
    const response = await axios.post(`/post/${postId}/comment`, payload);
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const bookMarkApi = async (postId) => {
  try {
    const response = await axios.post(`/post/${postId}/bookmark`, {});
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};
