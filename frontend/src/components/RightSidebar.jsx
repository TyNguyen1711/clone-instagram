import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers.jsx";
const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="my-10 pr-32">
      <div className="flex items-center gap-3 mb-5">
        <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <div className="font-semibold text-sm">
            <Link to={`/profile/${user._id}`}>{user.username}</Link>
          </div>
          <span className="text-gray-500 text-sm">
            {user.bio || "Bio here ..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
