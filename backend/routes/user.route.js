import express from "express";
import {
  addUserToHistorySearch,
  deleteAllHistorySearch,
  deleteUserFromHistoryUserSearch,
  editProfile,
  followingOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  searchUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/authenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router
  .route("/follow-or-unfollow/:id")
  .post(isAuthenticated, followingOrUnfollow);
router.route("/search").get(isAuthenticated, searchUser);

router
  .route("/history-search/add")
  .post(isAuthenticated, addUserToHistorySearch);

router
  .route("/history-search/delete")
  .delete(isAuthenticated, deleteUserFromHistoryUserSearch);

router
  .route("/history-search/delete-all")
  .delete(isAuthenticated, deleteAllHistorySearch);

export default router;
