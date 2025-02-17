import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import useGetAllMessage from "@/hooks/useGetAllMessage.js";
import { useSelector } from "react-redux";
import useGetRTM from "@/hooks/useGetRTM.js";
import { useNavigate } from "react-router-dom";

const Message = ({ selectedUser, messagesEndRef }) => {
  if (selectedUser) {
    useGetAllMessage();
    useGetRTM();
  }
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-0">
      <div className="py-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          
          <div>{selectedUser?.username}</div>
          <Button
            variant="ghost"
            className="bg-gray-100 h-8"
            onClick={() => navigate(`/profile/${selectedUser?._id}`)}
          >
            View profile
          </Button>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 break-words rounded-2xl max-w-xs ${
                msg.senderId === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Message;
