import express from "express";
import isAuthenticated from "../middlewares/authenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
const uploadFields = upload.fields([
  { name: "images", maxCount: 5 }, // Tối đa 5 ảnh
  { name: "videos", maxCount: 2 }, // Tối đa 2 video
  { name: "audio", maxCount: 1 }, // Tối đa 1 audio
]);
router.route("/send/:id").post(isAuthenticated, uploadFields, sendMessage);
router.route("/all/:id").get(isAuthenticated, getMessage);
export default router;
