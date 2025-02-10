import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import useGetAllMessage from "@/hooks/useGetAllMessage.js";
import { useSelector } from "react-redux";
import useGetRTM from "@/hooks/useGetRTM.js";
const Message = ({ selectedUser }) => {
  if (selectedUser) {
    useGetAllMessage();
    useGetRTM();
  }
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
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

      <div className="flex flex-col gap-3">
        {messages?.map((msg) => {
          return (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === user._id ? "justify-end" : "justify-start"
              } `}
            >
              <div
                className={`p-2 break-words rounded-2xl ${
                  msg.senderId === user._id
                    ? "bg-blue-500 mr-3 text-white"
                    : "bg-gray-300 ml-3"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Message;
