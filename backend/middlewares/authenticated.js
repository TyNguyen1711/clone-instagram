import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        mes: "User not authenticated",
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        success: false,
        mes: "Token is not valid",
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default isAuthenticated;
