import { setMessages } from "@/redux/chatSlice";
import { getAllMessageApi } from "@/services/api/message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const useGetAllMessage = async () => {
  try {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.auth);
    useEffect(() => {
      const fetchMessage = async () => {
        const response = await getAllMessageApi(selectedUser?._id);
        if (response.success) {
          dispatch(setMessages(response.messages));
        }
      };
      fetchMessage();
    }, []);
  } catch (error) {
    throw error;
  }
};
export default useGetAllMessage;
