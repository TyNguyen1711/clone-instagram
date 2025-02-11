import { toast } from "sonner";
import axios from "../axios.js";
export const registerApi = async ({ username, email, password }) => {
  try {
    const response = await axios.post("/user/register", {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const loginApi = async ({ email, password }) => {
  try {
    const response = await axios.post("/user/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);

    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await axios.post("/user/logout", {});
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const suggestedUsersApi = async () => {
  try {
    const response = await axios.get("/user/suggested");
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const getProfileApi = async (userId) => {
  try {
    const response = await axios.get(`user/${userId}/profile`);
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const editProfileApi = async (data) => {
  try {
    const response = await axios.post(`user/profile/edit`, data);
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};

export const followOrUnfollowApi = async (userId) => {
  try {
    const response = await axios.post(`/user/follow-or-unfollow/${userId}`, {});
    return response;
  } catch (error) {
    toast.error(error.response.data.mes);
    throw error;
  }
};
