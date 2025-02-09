import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
const Message = ({ selectedUser }) => {
  return (
    <div className="flex flex-col py-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar className="w-16 h-16">
          <AvatarImage src={selectedUser?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>{selectedUser?.username}</div>
        <Button variant="ghost" className="bg-gray-100 h-8">
          View profile
        </Button>
      </div>
    </div>
  );
};
export default Message;
