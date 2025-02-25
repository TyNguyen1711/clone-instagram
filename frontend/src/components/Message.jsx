import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import useGetAllMessage from "@/hooks/useGetAllMessage.js";
import { useSelector } from "react-redux";
import useGetRTM from "@/hooks/useGetRTM.js";
import { useNavigate } from "react-router-dom";

// Component to handle each message item
const MessageItem = ({ msg, isCurrentUser }) => {
  const { user } = useSelector((state) => state.auth);

  if (!msg.content || msg.content.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {msg.content.map((item, index) => {
        // Text messages appear in blue/gray bubble
        if (item.type === "text") {
          return (
            <div
              key={`text-${index}`}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 break-words rounded-2xl max-w-xs ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {item.data}
              </div>
            </div>
          );
        }

        // Media content (image, video, audio) appears standalone without bubbles
        return (
          <div
            key={`media-${index}`}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {item.type === "image" && (
              <img
                src={item.data}
                alt="Image message"
                className="max-w-xs rounded-lg max-h-64 object-contain"
              />
            )}

            {item.type === "video" && (
              <video
                src={item.data}
                controls
                className="max-w-xs rounded-lg max-h-64"
              />
            )}

            {item.type === "audio" && (
              <audio src={item.data} controls className="max-w-xs w-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};

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

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {messages?.map((msg) => (
          <MessageItem
            key={msg._id}
            msg={msg}
            isCurrentUser={msg.senderId === user._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Message;
