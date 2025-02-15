import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { RiPokerHeartsLine } from "react-icons/ri";
import timeAgo from "@/lib/timeAgo";
import { Link } from "react-router-dom";
const Comment = ({ comment, handleReplyClick }) => {
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
  return (
    <div className="mb-6 flex relative">
      <div className="flex gap-3 items-center">
        <div className="absolute right-0 top-3 hover:text-gray-400 cursor-pointer transition-all">
          <RiPokerHeartsLine size={14} />
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
