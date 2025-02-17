import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice.js";
import { LuMessageCircleCode } from "react-icons/lu";
import { Button } from "./ui/button";
import { sendMessageApi } from "@/services/api/message.js";
import { setMessages } from "@/redux/chatSlice";
import Message from "./Message";
import { Smile } from "lucide-react";
import { IconGalary, IconHeart, IconSticker, Microphone } from "./icon";
const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state) => state.auth
  );
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageHandler = async () => {
    try {
      if (textMessage.trim()) {
        const res = await sendMessageApi(textMessage, selectedUser?._id);
        if (res.success) {
          dispatch(setMessages([...messages, res.newMessage]));
          setTextMessage("");
          // Scroll xuống cuối sau khi gửi tin nhắn
          setTimeout(scrollToBottom, 100);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    dispatch(setSelectedUser(null));
  }, []);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen ml-[5%] flex">
      {/* Users List Section */}
      <section className="w-full w-[400px] h-screen flex flex-col border-r border-gray-300">
        <div className="p-4 py-8">
          <h1 className="font-bold text-[20px]">{user?.username}</h1>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {suggestedUsers?.map((suggestedUser, index) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium truncate">
                    {suggestedUser?.username}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section className="flex-1 h-screen flex flex-col">
          <div className="flex items-center gap-2 border-b border-b-gray-300 py-4 px-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <div>{selectedUser?.username}</div>
              <div className="text-[12px] text-gray-500">
                {onlineUsers.includes(selectedUser?._id)
                  ? "Active now"
                  : "No active"}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {selectedUser && (
              <Message
                selectedUser={selectedUser}
                messagesEndRef={messagesEndRef}
              />
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 border border-gray-400 px-4 rounded-xl">
              <button className="hover:bg-gray-100 rounded-full">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>

              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                placeholder="Messages ..."
                className="flex-1 p-3 border border-gray-200 rounded focus-visible:ring-transparent outline-none border-none"
                onKeyPress={(e) => e.key === "Enter" && sendMessageHandler()}
              />
              {textMessage ? (
                <button onClick={sendMessageHandler}>Send</button>
              ) : (
                <div className="flex items-center gap-4">
                  <Microphone width="1.5rem" height="1.5rem" />
                  <IconGalary width="1.5rem" height="1.5rem" />
                  <IconSticker width="1.5rem" height="1.5rem" />
                  <IconHeart width="1.5rem" height="1.5rem" />
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <LuMessageCircleCode className="w-32 h-32 mb-4" />
          <h1 className="text-xl font-medium">Your messages</h1>
          <span className="text-gray-500">Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
