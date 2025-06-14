import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// import { BookMark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog.jsx";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  bookMarkApi,
  commentPostApi,
  deletePostApi,
} from "@/services/api/post";
import { setPosts } from "@/redux/postSlice.js";
import { toast } from "sonner";
import { likeOrDislikeHandler } from "@/services/api/post.js";
import { setSelectedPost } from "@/redux/postSlice.js";
import { Badge } from "./ui/badge";
import { setAuthUser } from "@/redux/authSlice";
const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const liked = post.likes.includes(user?._id);
  const bookMarked = user?.bookmarks?.includes(post?._id);
  const postLike = post.likes.length;
  const extractMentions = (text) => {
    const regex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      mentions.push({
        username: match[1],
        indices: [match.index, match.index + match[0].length],
      });
    }
    return mentions;
  };
  const dispatch = useDispatch();
  const handlerDeletePost = async () => {
    const response = await deletePostApi(post._id);
    if (response.success) {
      toast.success(response.mes);
      const updatePosts = posts.filter((item) => item._id !== post._id);
      dispatch(setPosts(updatePosts));
      setOpen(false);
    }
  };
  const handleLikeOrDislike = async () => {
    const action = liked ? "dislike" : "like";
    const response = await likeOrDislikeHandler(post._id, action);

    if (response.success) {
      const updatePostsData = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
          : p
      );
      dispatch(setPosts(updatePostsData));
      toast.success(response.message);
    }
  };
  const commentHandler = async () => {
    const extractedMentions = extractMentions(text);
    const payload = {
      text,
      mentions: extractedMentions,
    };
    const response = await commentPostApi(post._id, payload);
    if (response.success) {
      toast.success(response.message);
      setText("");

      const updatePostsData = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              comments: [response.comment, ...p.comments],
            }
          : p
      );
      dispatch(setPosts(updatePostsData));
    }
  };
  const handlerClickBookmark = async () => {
    const response = await bookMarkApi(post?._id);

    if (response.success) {
      const newBookmarkData = bookMarked
        ? (user.bookmarks || []).filter((item) => item !== post?._id)
        : [...(user.bookmarks || []), post._id];

      const newUserData = { ...user, bookmarks: newBookmarkData };
      dispatch(setAuthUser(newUserData));
      toast.success(response.mes || "Updated bookmark!");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
          {post.author._id === user._id && (
            <Badge className="bg-gray-100 rounded-xl" variant="destructive">
              Author
            </Badge>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {user._id !== post.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {post?.author._id === user._id && (
              <Button
                onClick={handlerDeletePost}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {post?.type === "image" ? (
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover object-center"
          src={post?.srcURL}
          alt=""
        />
      ) : (
        <video className="w-full h-full rounded-md my-2" controls>
          <source src={post?.srcURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {liked ? (
              <FaHeart
                size={"22"}
                onClick={handleLikeOrDislike}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={handleLikeOrDislike}
                className="cursor-pointer hover:text-gray-600"
                size={"22px"}
              />
            )}

            <MessageCircle
              className="cursor-pointer hover:text-gray-600"
              onClick={() => {
                setOpen(true);
                dispatch(setSelectedPost(post));
              }}
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark
            onClick={handlerClickBookmark}
            className={`cursor-pointer hover:text-gray-600 ${
              bookMarked ? "fill-black" : "fill-none"
            }`}
          />
        </div>
        <span className="font-medium block mb-2">{postLike} likes</span>
        <p>
          <span className="font-medium mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
        {post.comments.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer text-sm text-gray-400"
          >
            View all {post.comments.length} comments
          </span>
        )}

        <CommentDialog
          open={open}
          setOpen={setOpen}
          liked={liked}
          handleLikeOrDislike={handleLikeOrDislike}
          postLike={postLike}
          bookMarked={bookMarked}
          handlerClickBookmark={handlerClickBookmark}
        />
        <div className="flex my-2 items-center">
          <input
            type="text"
            placeholder="Add a comment"
            value={text}
            onChange={(e) => {
              if (e.target.value.trim()) {
                setText(e.target.value);
              } else {
                setText("");
              }
            }}
            className="outline-none text-sm w-full"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="cursor-pointer text-[#3BADFB] mr-2"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
