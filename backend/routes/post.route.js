import express from "express";
import isAuthenticated from "../middlewares/authenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsPost,
  getUserPost,
  likePost,
  getPostOfNumberLike
} from "../controllers/post.controller.js";
const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("media"), addNewPost);
router.route("/all").get(isAuthenticated, getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").get(isAuthenticated, getCommentsPost);
router.route("/delete/:id").post(isAuthenticated, deletePost);
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);
router.route("/explore").get(isAuthenticated, getPostOfNumberLike)
export default router;
