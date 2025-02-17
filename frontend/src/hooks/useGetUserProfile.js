import { getProfileApi } from "@/services/api/user.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "@/redux/authSlice.js";
const useGetUserProfile = (userId) => {
  try {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
      const fetchUserProfile = async () => {
        const res = await getProfileApi(userId);
        if (res.success) {
          dispatch(setUserProfile(res.user));
        }
      };
      fetchUserProfile();
    }, [userId, user]);
  } catch (error) {
    throw error;
  }
};
export default useGetUserProfile;
