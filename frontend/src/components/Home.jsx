import React from "react";
import Feed from "./Feed.jsx";
import { Outlet } from "react-router-dom";
import useGetAllPosts from "@/hooks/useGetAllPosts.js";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers.js";
import RightSidebar from "./RightSidebar";

const Home = () => {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className="flex">
      <div className="flex-1">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
