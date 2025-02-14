import express from "express";
import {
  likeOrDislikeComment,
  replyComment,
} from "../controllers/comment.controller.js";
import isAuthenticated from "../middlewares/authenticated.js";
const router = express.Router();

router.route("/like-or-dislike").post(isAuthenticated, likeOrDislikeComment);
router.route("/reply").post(isAuthenticated, replyComment);
export default router;
