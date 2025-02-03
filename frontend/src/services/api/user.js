import axios from "../axios.js";
export const register = async ({ username, email, password }) => {
  try {
    const response = await axios.post("/user/register", {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
