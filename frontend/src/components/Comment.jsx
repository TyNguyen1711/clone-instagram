import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
const Comment = ({ comment }) => {
  return (
    <div className="mb-4">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage
            src={comment.author.profilePicture}
            alt="img"
            className="w-full h-full"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">
          {comment.author.username}{" "}
          <span className="font-normal pl-2">{comment.text}</span>
        </h1>
      </div>
    </div>
  );
};
export default Comment;
