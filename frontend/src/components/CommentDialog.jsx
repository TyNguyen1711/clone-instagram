import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { commentPostApi, likeOrDislikeHandler } from "@/services/api/post.js";
import EmojiPicker from "emoji-picker-react";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";

import { toast } from "sonner";
import Comment from "./Comment";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

const CommentDialog = ({
  open,
  setOpen,
  liked,
  handleLikeOrDislike,
  postLike,
  bookMarked,
  handlerClickBookmark,
}) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { selectedPost } = useSelector((state) => state.post);
  const [replyUser, setReplyUser] = useState("");
  const { posts } = useSelector((state) => state.post);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const handleReplyClick = (username) => {
    setReplyUser(`@${username} `);
    setText(`@${username} `);
    inputRef.current.focus();
  };
  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);
  const handleChangeInput = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
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
  const sendMessageHandler = async () => {
    const extractedMentions = extractMentions(text);
    const payload = {
      text,
      mentions: extractedMentions,
    };
    const response = await commentPostApi(selectedPost._id, payload);
    if (response.success) {
      toast.success(response.message);
      setComment([response.comment, ...comment]);
      const updatePostsData = posts?.map((p) =>
        p._id === selectedPost._id
          ? {
              ...p,
              comments: [response.comment, ...p.comments],
            }
          : p
      );
      setText("");
      dispatch(setPosts(updatePostsData));
      dispatch(
        setSelectedPost({
          ...selectedPost,
          comments: [response.comment, ...selectedPost.comments],
        })
      );
    }

  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col h-[92vh] max-h-[700px] overflow-hidden"
      >
        <div className="flex flex-1 h-full">
          <div className="w-1/2 bg-black flex items-center justify-center">
            {selectedPost?.type === "image" ? (
              <img
                className="w-full h-full object-cover"
                src={selectedPost?.srcURL}
                alt="post"
              />
            ) : (
              <video
                className="w-full h-full object-cover object-center custom-video"
                controls
                autoPlay
              >
                <source src={selectedPost?.srcURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="w-1/2 flex flex-col h-full">
            <div className="flex justify-between items-center border-b border-gray-200 py-3 px-4">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedPost?.author.profilePicture}
                      alt="profile"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm">
                    {selectedPost?.author.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <Button variant="ghost" className="text-[#ED4956] font-bold">
                    Unfollow
                  </Button>
                  <Button variant="ghost">Add to favorites</Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-4">
                {comment?.map((comment, index) => (
                  <Comment
                    key={index}
                    comment={comment}
                    handleReplyClick={handleReplyClick}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-gray-300 bg-white">
              <div className="border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 px-4 pt-3">
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
                      size={24}
                    />
                    <Send
                      className="cursor-pointer hover:text-gray-600"
                      size={24}
                    />
                  </div>
                  <div className="mr-3">
                    <Bookmark
                      onClick={handlerClickBookmark}
                      className={`cursor-pointer hover:text-gray-600 ${
                        bookMarked ? "fill-black" : "fill-none"
                      }`}
                    />
                  </div>
                </div>
                <div className="px-5 pt-3 text-sm font-semibold">
                  {postLike} likes
                </div>
                <div className="px-5 text-[12px] text-gray-500 pb-2">
                  21 thang 1
                </div>
              </div>
              <div className="p-1 flex items-center relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 rounded-full mr-2"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-10">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Thêm bình luận..."
                  className="outline-none w-full text-sm py-2"
                  value={text}
                  onChange={handleChangeInput}
                />
                <Button
                  disabled={!text.trim()}
                  variant="ghost"
                  className="text-blue-500 font-semibold disabled:opacity-50 disabled:text-blue-200"
                  onClick={sendMessageHandler}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
