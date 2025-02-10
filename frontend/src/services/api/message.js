import { toast } from "sonner";
import axios from "../axios.js";
export const sendMessageApi = async (message, receiverId) => {
  try {
    const response = await axios.post(`/message/send/${receiverId}`, {
      message: message,
    });
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const getAllMessageApi = async (receiverId) => {
  try {
    const response = await axios.get(`/message/all/${receiverId}`);
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};
