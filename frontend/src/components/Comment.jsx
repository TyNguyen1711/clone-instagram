import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { RiPokerHeartsLine } from "react-icons/ri";
const Comment = ({ comment }) => {
  return (
    <div className="mb-6 flex relative">
      <div className="flex gap-3 items-center">
        <div className="absolute right-0 top-3">
          <RiPokerHeartsLine size={14} />
        </div>
        <div className="mr-1">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.author.profilePicture}
              alt="img"
              className="w-full h-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <h1 className="font-bold text-sm">
              {comment.author.username}{" "}
              <span className="font-normal pl-2">{comment.text}</span>
            </h1>
          </div>
          <div className="flex items-center text-[12px] gap-3 text-[#7c7c7c] cursor-pointer">
            <div>1 tuan</div>
            <div>300 like</div>
            <div>Reply</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Comment;
