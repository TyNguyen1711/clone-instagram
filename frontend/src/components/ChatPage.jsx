import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice.js";
import { LuMessageCircleCode } from "react-icons/lu";
import { Button } from "./ui/button";
import { sendMessageApi } from "@/services/api/message.js";
import { setMessages } from "@/redux/chatSlice";
import Message from "./Message";

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
    dispatch(setSelectedUser(null))
  }, []);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen ml-[16%] flex">
      {/* Users List Section */}
      <section className="w-full md:w-1/4 h-screen flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h1 className="font-medium">{user?.username}</h1>
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
                  <AvatarImage src={suggestedUser?.profilePicture} alt="avatar" />
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
        <section className="border-l border-l-gray-300 flex-1 h-screen flex flex-col">
          <div className="flex items-center gap-3 border-b border-b-gray-300 py-2 px-3">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>{selectedUser?.username}</div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {selectedUser && <Message selectedUser={selectedUser} messagesEndRef={messagesEndRef} />}
          </div>

          <div className="p-4 border-t border-gray-300">
            <div className="flex items-center gap-2">
              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                placeholder="Messages ..."
                className="flex-1 p-2 border border-gray-200 rounded focus-visible:ring-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler()}
              />
              <Button onClick={sendMessageHandler}>Send</Button>
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