import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logoutApi } from "@/services/api/user.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { setPosts } from "@/redux/postSlice";
import { setSelectedPost } from "@/redux/postSlice";
import { GoHome, GoHomeFill } from "react-icons/go";
import { setSelectedUser } from "@/redux/authSlice";
import { LogoInstagramIcon } from "./icon/index.jsx";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setMessages } from "@/redux/chatSlice";
const LeftSidebar = () => {
  const { user, selectedUser } = useSelector((state) => state.auth);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [type, setType] = useState("Home");
  const sidebarItems = [
    {
      icon: type === "Home" ? <GoHomeFill size={24} /> : <GoHome size={24} />,
      text: "Home",
    },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const response = await logoutApi();
    if (response.success) {
      dispatch(setAuthUser(null));
      dispatch(setPosts([]));
      dispatch(setUserProfile(null));
      dispatch(setSelectedPost(null));
      dispatch(setSelectedUser(null));
      dispatch(setMessages([]));
      navigate("/login");
    }
  };
  const handleCreatePost = async () => {
    setOpenCreatePost(true);
  };
  const sidebarHandler = async (textType) => {
    setType(textType);
    if (textType === "Logout") {
      handleLogout();
    } else if (textType === "Create") {
      handleCreatePost();
    } else if (textType === "Profile") {
      navigate(`/profile/${user._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };
  return (
    <div className="fixed top-0 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div>
        <LogoInstagramIcon />
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex items-center px-5 py-5 hover:bg-gray-100 cursor-pointer rounded ${
                  item.text === type ? "font-bold" : ""
                }`}
                onClick={() => sidebarHandler(item.text)}
              >
                <div className={`mr-2`}>{item.icon}</div>
                <div>{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost
        openCreatePost={openCreatePost}
        setOpenCreatePost={setOpenCreatePost}
      />
    </div>
  );
};
export default LeftSidebar;
