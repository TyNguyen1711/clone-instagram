import { getProfileApi } from "@/services/api/user.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice.js";
const useGetUserProfile = (userId) => {
  try {
    const dispatch = useDispatch();
    useEffect(() => {
      const fetchUserProfile = async () => {
        const res = await getProfileApi(userId);
        if (res.success) {
          dispatch(setUserProfile(res.user));
        }
      };
      fetchUserProfile();
    }, [userId]);
  } catch (error) {
    throw error;
  }
};
export default useGetUserProfile;
