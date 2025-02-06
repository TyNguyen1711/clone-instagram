import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { BookMarked, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog.jsx";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { commentPostApi, deletePostApi } from "@/services/api/post";
import { setPosts } from "@/redux/postSlice.js";
import { toast } from "sonner";
import { likeOrDislikeHandler } from "@/services/api/post.js";
import { setSelectedPost } from "@/redux/postSlice.js";
const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const { selectedPost } = useSelector((state) => state.post);

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
      const updateLike = liked ? postLike - 1 : postLike + 1;
      setPostLike(updateLike);
      setLiked(!liked);

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
    const response = await commentPostApi(post._id, text);
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
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
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
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover object-center"
        src={post?.image}
        alt=""
      />
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
          <BookMarked className="cursor-pointer hover:text-gray-600" />
        </div>
        <span className="font-medium block mb-2">{postLike} likes</span>
        <p>
          <span className="font-medium mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
        <span
          onClick={() => setOpen(true)}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {post.comments.length} comments
        </span>
        <CommentDialog open={open} setOpen={setOpen} />
        <div className="flex my-2 items-center">
          <input
            type="text"
            placeholder="Add a comment"
            value={text}
            onChange={(e) => {
              if (e.target.value.trim()) {
                setText(e.target.value.trim());
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
