import React, { useEffect, useState } from "react";
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
  const sendMessageHandler = async () => {
    try {
      if (textMessage.trim()) {
        const res = await sendMessageApi(textMessage, selectedUser?._id);
        console.log("response: ", res);
        if (res.success) {
          console.log("1: ", messages);
          console.log("mesage: ")
          dispatch(setMessages([...messages, res.newMessage]));
          setTextMessage("");
        }
      }
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    dispatch(setSelectedUser(null))
  }, []);
  return (
    <div className="h-screen ml-[16%] flex">
      <section className="w-full md:w-1/4 py-4">
        <h1 className="p-3">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="h-[80vh] overflow-y-auto">
          {suggestedUsers &&
            suggestedUsers.map((suggestedUser, index) => {
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
      {selectedUser ? (
        <section className="border-l border-l-gray-300 flex-1">
          <div className="flex items-center gap-3 border-b border-b-gray-300 py-2 px-3">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>{selectedUser?.username}</div>
          </div>
          {selectedUser && <Message selectedUser={selectedUser} />}
          <div className="flex items-center p-2">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              placeholder="Messages ..."
              className="flex-1 p-2 mr-3 border border-gray-200 rounded focus-visible:ring-transparent outline-none"
            />
            <Button onClick={() => sendMessageHandler()}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center mx-auto justify-center">
          <LuMessageCircleCode className="w-32 h-32 my-4" />
          <h1>Your messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};
export default ChatPage;
