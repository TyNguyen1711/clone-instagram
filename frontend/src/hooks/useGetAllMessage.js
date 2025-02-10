import { setMessages } from "@/redux/chatSlice";
import { getAllMessageApi } from "@/services/api/message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const useGetAllMessage = async () => {
  try {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.auth);
    console.log("123: ", selectedUser);
    useEffect(() => {
      const fetchMessage = async () => {
        const response = await getAllMessageApi(selectedUser?._id);
        console.log(122213);
        console.log("222:", response);
        if (response.success) {
          console.log("Reponse: ", response);
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
