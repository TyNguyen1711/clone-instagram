import useGetUserProfile from "@/hooks/useGetUserProfile";
import { IoHeartSharp } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { TbMessageCircle } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { followOrUnfollowApi } from "@/services/api/user";
import { toast } from "sonner";
import {
  setAuthUser,
  setSelectedUser,
  setUserProfile,
} from "@/redux/authSlice";
import { setSelectedPost } from "@/redux/postSlice";
import CommentDialog from "./CommentDialog";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");
  const { user, userProfile } = useSelector((state) => state.auth);
  const displayPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isFollowing, setFollowing] = useState(
    user?.following.find((id) => id === userProfile?._id)
  );
  const dispatch = useDispatch();
  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };
  const navigate = useNavigate();
  const handleFollowUnfollowUser = async () => {
    try {
      const response = await followOrUnfollowApi(userProfile?._id);
      if (response.success) {
        if (isFollowing) {
          const updateFollowers = userProfile?.followers.filter(
            (follower) => follower !== user._id
          );
          const updateFollowings = user?.following.filter(
            (following) => following !== userProfile._id
          );
          dispatch(
            setUserProfile({ ...userProfile, followers: updateFollowers })
          );
          dispatch(setAuthUser({ ...user, following: updateFollowings }));
        } else {
          const updateFollowers = [...userProfile?.followers, user._id];
          const updateFollowings = [...user.following, userProfile._id];
          dispatch(
            setUserProfile({ ...userProfile, followers: updateFollowers })
          );
          dispatch(setAuthUser({ ...user, following: updateFollowings }));
        }
        setFollowing(!isFollowing);

        toast.success(response.mes);
      }
    } catch (error) {
      throw error;
    }
  };
  const handlerClickMessage = () => {
    dispatch(setSelectedUser(userProfile));
    navigate("/chat");
  };
  const handlerClickPost = (post) => {
    setOpen(true);
    dispatch(setSelectedPost(post));
  };
  return (
    <div className="max-w-5xl mx-auto pl-20 justify-center">
      <div className="grid grid-cols-2 pt-8">
        <section className="flex items-center justify-center">
          <Avatar className="w-36 h-36">
            <AvatarImage src={userProfile?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </section>
        <section>
          <div className="flex items-center gap-5">
            <div>{userProfile?.username}</div>
            <div className="flex gap-2">
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Edit profile
                    </Button>
                  </Link>
                  <Button variant="secondary" className="hover:bg-gray-200 h-8">
                    View Archive
                  </Button>
                  <Button variant="secondary" className="hover:bg-gray-200 h-8">
                    Add tools
                  </Button>
                </>
              ) : isFollowing ? (
                <>
                  {" "}
                  <Button
                    onClick={handleFollowUnfollowUser}
                    variant="secondary"
                    className="h-8"
                  >
                    Unfollow
                  </Button>
                  <Button
                    onClick={handlerClickMessage}
                    variant="secondary"
                    className="h-8"
                  >
                    Message
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8 text-[#FFFFFF]"
                    onClick={handleFollowUnfollowUser}
                  >
                    Follow
                  </Button>
                  <Button
                    onClick={handlerClickMessage}
                    variant="secondary"
                    className="h-8"
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
          <CommentDialog open={open} setOpen={setOpen} />
          <div className="flex items-center gap-10 py-4">
            <div>
              <span className="font-semibold">{userProfile?.posts.length}</span>{" "}
              posts
            </div>
            <div>
              <span className="font-semibold">
                {userProfile?.followers.length}
              </span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {userProfile?.following.length}
              </span>{" "}
              following
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">
              {userProfile?.bio || "Bio here ..."}
            </div>
            <Badge className="w-fit bg-gray-100" variant="secondary">
              <AtSign size={20} />
              {userProfile?.username}
            </Badge>
            <span>Clone instagram with reactjs and nodejs</span>
            <span>Clone instagram with reactjs and nodejs</span>
            <span>Clone instagram with reactjs and nodejs</span>
          </div>
        </section>
      </div>

      <div className="mt-10 mb-5 border-t-gray-200 border-t">
        <div className="flex items-center justify-center gap-20">
          <span
            onClick={() => {
              handleChangeTab("posts");
            }}
            className={`py-3 cursor-pointer font-medium relative ${
              activeTab === "posts"
                ? "text-gray-900 before:absolute before:top-[-1px] before:left-0 before:w-full before:h-[2px] before:bg-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            POSTS
          </span>
          <span
            onClick={() => {
              handleChangeTab("saved");
            }}
            className={`py-3 cursor-pointer font-medium relative ${
              activeTab === "saved"
                ? "text-gray-900 before:absolute before:top-[-1px] before:left-0 before:w-full before:h-[2px] before:bg-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            SAVED
          </span>
          <span
            onClick={() => {
              handleChangeTab("reels");
            }}
            className={`py-3 cursor-pointer font-medium relative ${
              activeTab === "reels"
                ? "text-gray-900 before:absolute before:top-[-1px] before:left-0 before:w-full before:h-[2px] before:bg-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            REELS
          </span>
          <span
            onClick={() => {
              handleChangeTab("tags");
            }}
            className={`py-3 cursor-pointer font-medium relative ${
              activeTab === "tags"
                ? "text-gray-900 before:absolute before:top-[-1px] before:left-0 before:w-full before:h-[2px] before:bg-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            TAGS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {displayPosts?.map((post, index) => {
          return (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => {
                handlerClickPost(post);
              }}
            >
              {post?.type === "image" ? (
                <img
                  src={post.srcURL}
                  alt="img"
                  className="rounded-sm aspect-square object-cover w-full"
                />
              ) : (
                <video className="rounded-sm w-full h-full object-cover">
                  <source src={post?.srcURL} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 rounded flex items-center opacity-0 justify-center bg-black bg-opacity-50 group-hover:opacity-100 transitition-opacity duration-300">
                <div className="flex items-center text-white gap-6">
                  <button className="flex items-center gap-1">
                    <IoHeartSharp size={25} />
                    <span>{post?.likes.length}</span>
                  </button>

                  <button className="flex items-center gap-1">
                    <MessageCircle className="fill-white" />
                    <span>{post?.comments.length}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
