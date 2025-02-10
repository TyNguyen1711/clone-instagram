import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
const useGetRTM = () => {
  const { socket } = useSelector((state) => state.socketio);
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
};
export default useGetRTM;
