import { useEffect } from "react";
import { suggestedUsersApi } from "@/services/api/user.js";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice.js";
const useGetSuggestedUsers = () => {
  try {
    const dispatch = useDispatch();
    useEffect(() => {
      const fetchSuggestedUsers = async () => {
        const response = await suggestedUsersApi();

        dispatch(setSuggestedUsers(response.user));
      };
      fetchSuggestedUsers();
    }, []);
  } catch (error) {
    throw error;
  }
};
export default useGetSuggestedUsers;
