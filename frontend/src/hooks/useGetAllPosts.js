import { setPosts } from "@/redux/postSlice.js";
import { getAllPost } from "@/services/api/post.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await getAllPost();
        if (response.success) {
          dispatch(setPosts(response.posts));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAllPosts();
  }, [dispatch]);
};

export default useGetAllPosts;
