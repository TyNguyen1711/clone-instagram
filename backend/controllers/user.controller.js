import { User } from "../models/user.model.js";
import brcypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../util/datauri.js";
import cloudinary from "../config/cloudinary.js";
import Fuse from "fuse.js";
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({
        success: false,
        mes: "Missing input",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        success: false,
        mes: "Email exist. Try different email",
      });
    }
    const hashedPassword = await brcypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    return res.status(201).json({
      success: true,
      mes: "Account create successfully",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        mes: "Missing input",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        mes: "Incorrect email",
      });
    }
    const isPasswordMatch = await brcypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        mes: "Password incorrect!",
      });
    }
    // user = {
    //   _id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   profilePicture: user.profilePicture,
    //   bio: user.bio,
    //   followers: user.followers,
    //   following: user.following,
    //   posts: user.posts,
    // };
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    delete user["password"];
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        mes: `Welcome back ${user.username}`,
        user,
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      success: true,
      mes: "Logout successfully",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId })
      .select("-password")
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate({
        path: "bookmarks",
        model: "Post",
      });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    throw error;
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({
        success: false,
        mes: "User not found",
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({
      success: true,
      mes: "Update profile successfully",
      user,
    });
  } catch (error) {
    throw error;
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(401).json({
        success: false,
        mes: "Currently do not any users",
      });
    }
    return res.status(201).json({
      success: true,
      user: suggestedUsers,
    });
  } catch (error) {
    throw error;
  }
};

export const followingOrUnfollow = async (req, res) => {
  try {
    const followerId = req.id;
    const followingId = req.params.id;
    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        mes: "You cannot follow/unfollow yourself",
      });
    }
    const user = await User.findById(followerId);
    const targetUser = await User.findById(followingId);
    if (!user || !targetUser) {
      return res.json(401).json({
        success: false,
        mes: "User not found",
      });
    }
    const isFollowing = user.following.includes(followingId);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $pull: { following: followingId } }
        ),
        User.updateOne(
          { _id: followingId },
          { $pull: { followers: followerId } }
        ),
      ]);
      return res.status(200).json({
        success: true,
        mes: "Unfollow successfully",
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $push: { following: followingId } }
        ),
        User.updateOne(
          { _id: followingId },
          { $push: { followers: followerId } }
        ),
      ]);
      return res.status(200).json({
        success: true,
        mes: "Follow successfully",
      });
    }
  } catch (error) {
    throw error;
  }
};

export const searchUser = async (req, res) => {
  try {
    const userId = req.id;
    const query = req.query.search;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Missing input",
      });
    }
    let users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: userId },
    })
      .select("username bio isUserBlue followers profilePicture")
      .limit(5);
    if (users.length < 5) {
      const allUser = await User.find({
        _id: { $ne: userId },
      });

      const fuse = new Fuse(allUser, {
        keys: ["username"],
        threshold: 0.4,
        distance: 100,
      });
      const fuzzyResults = fuse.search(query).map((result) => result.item);
      const additionalUsers = fuzzyResults
        .filter((u) => !users.some((user) => user._id.equals(u._id)))
        .slice(0, 5 - users.length);

      users = [...users, ...additionalUsers];
    }
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    throw error;
  }
};

export const addUserToHistorySearch = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findOne({ _id: userId });
    const searchUserId = req.body.searchUserId;
    const index = user.historySearch.indexOf(searchUserId);

    if (index !== -1) {
      user.historySearch.splice(index, 1);
    }

    user.historySearch.unshift(searchUserId);

    if (user.historySearch.length > 10) {
      user.historySearch.pop();
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Add history search successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUserFromHistoryUserSearch = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findOne({ _id: userId });
    const searchUserId = req.body.searchUserId;
    const updateHistorySearch = user.historySearch.filter(
      (id) => id !== searchUserId
    );
    user.historySearch = updateHistorySearch;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Delete history search successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteAllHistorySearch = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findOne({ _id: userId });
    user.historySearch = [];
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Delete all search history successfully",
    });
  } catch (error) {
    throw error;
  }
};
