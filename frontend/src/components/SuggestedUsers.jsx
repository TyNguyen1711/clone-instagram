import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((state) => state.auth);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-gray-500">Suggested for you</div>
        <div className="font-medium cursor-pointer">See all</div>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-3">
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
            <div className="text-[#3BADF8] text-sm font-bold cursor-pointer">
              Follow
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SuggestedUsers;
