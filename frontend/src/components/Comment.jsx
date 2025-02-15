import React, { useState } from "react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { RiPokerHeartsLine } from "react-icons/ri";
import { IoHeart } from "react-icons/io5";
import timeAgo from "@/lib/timeAgo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeOrDislikeComment } from "@/services/api/comment";
import { setSelectedPost, setPosts } from "@/redux/postSlice";
const Comment = ({ comment, handleReplyClick }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedPost } = useSelector((state) => state.post);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const likedComment = comment?.likes.includes(user._id);
  const renderTextWithMentions = (text, mentions) => {
    if (!mentions || !Array.isArray(mentions) || mentions.length === 0) {
      return <span>{text}</span>;
    }

    // Sắp xếp mentions theo vị trí bắt đầu để xử lý đúng thứ tự
    const sortedMentions = [...mentions].sort(
      (a, b) => a.indices[0] - b.indices[0]
    );

    let lastIndex = 0;
    const nodes = [];

    sortedMentions.forEach((mention, index) => {
      if (!mention.indices || mention.indices.length !== 2) {
        return; // Bỏ qua mentions không hợp lệ
      }

      const [start, end] = mention.indices;

      // Thêm text trước mention
      if (start > lastIndex && start < text.length) {
        nodes.push(
          <span key={`text-${index}`}>{text.substring(lastIndex, start)}</span>
        );
      }

      // Thêm mention với Link và style khác
      if (start < text.length && end <= text.length) {
        nodes.push(
          <Link
            key={`mention-${index}`}
            to={`/profile/${mention?.userId}`}
            className="text-blue-500 hover:underline"
          >
            {text.substring(start, end)}
          </Link>
        );

        lastIndex = end;
      }
    });

    if (lastIndex < text.length) {
      nodes.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return <>{nodes}</>;
  };
  const handleClickHeart = async () => {
    const response = await likeOrDislikeComment(comment?._id);
    if (response.success) {
      const currentPost = posts.find((p) => p._id === selectedPost._id);

      if (response.type === "like") {
        const updatedComments = currentPost.comments.map((item) =>
          item._id === comment._id
            ? { ...item, likes: [...item.likes, user._id] }
            : item
        );
        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPosts));
        dispatch(
          setSelectedPost({ ...selectedPost, comments: updatedComments })
        );
      } else {
        const updatedComments = currentPost.comments.map((item) =>
          item._id === comment._id
            ? { ...item, likes: item.likes.filter((i) => i !== user._id) }
            : item
        );

        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPosts));
        dispatch(
          setSelectedPost({ ...selectedPost, comments: updatedComments })
        );
      }
    }
  };
  return (
    <div className="mb-6 flex relative">
      <div className="flex gap-3 items-center">
        <div
          className="absolute right-0 top-3 hover:text-gray-400 cursor-pointer transition-all"
          onClick={handleClickHeart}
        >
          {likedComment ? (
            <div className="cursor-pointer text-red-500">
              <IoHeart size={14} />
            </div>
          ) : (
            <div>
              <RiPokerHeartsLine size={14} />
            </div>
          )}
        </div>
        <div className="mr-1">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment?.author.profilePicture}
              alt="img"
              className="w-full h-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <h1 className="font-bold text-sm">
              {comment?.author.username}{" "}
              <span className="font-normal pl-2">
                <span className="font-normal pl-2">
                  {renderTextWithMentions(comment?.text, comment?.mentions)}
                </span>
              </span>
            </h1>
          </div>
          <div className="flex items-center text-[12px] gap-3 text-[#7c7c7c] cursor-pointer">
            <div>{timeAgo(comment?.createdAt)}</div>
            <div className="font-semibold">{comment?.likes.length} likes</div>
            <div
              className="font-semibold"
              onClick={() => {
                handleReplyClick(comment.author.username);
              }}
            >
              Reply
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Comment;
