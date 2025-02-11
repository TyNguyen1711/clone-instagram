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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { setPosts } from "@/redux/postSlice";
import { setSelectedPost } from "@/redux/postSlice";
import { GoHome, GoHomeFill } from "react-icons/go";
import { setSelectedUser } from "@/redux/authSlice";
import { LogoInstagramIcon } from "./icon/index.jsx";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa6";
import CreatePost from "./CreatePost";
import { setMessages } from "@/redux/chatSlice";

const LeftSidebar = () => {
  const { user, selectedUser } = useSelector((state) => state.auth);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [type, setType] = useState("Home");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapsibleRoutes = ["Search", "Explore", "Messages", "Notifications"];

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
    setIsCollapsed(collapsibleRoutes.includes(textType));

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
    <div
      className={`fixed top-0 left-0 h-screen border-r border-gray-300 transition-all duration-300 ease-in-out flex flex-col 
      ${isCollapsed ? "w-16" : "w-60"}`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex justify-center items-center p-4">
          <Link to="/" className="flex justify-center items-center">
            {!isCollapsed ? (
              <LogoInstagramIcon
                className={`cursor-pointer transition-transform`}
              />
            ) : (
              <div
                onClick={() => {
                  setIsCollapsed(false);
                }}
              >
                <FaInstagram size={22} />
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-start rounded-lg mb-1 p-3 cursor-pointer
                hover:bg-gray-100 transition-colors
                ${item.text === type ? "font-bold" : ""}
                ${isCollapsed ? "justify-center" : "px-4"}`}
              onClick={() => sidebarHandler(item.text)}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-sm whitespace-nowrap">
                  {item.text}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <CreatePost
        openCreatePost={openCreatePost}
        setOpenCreatePost={setOpenCreatePost}
      />
    </div>
  );
};

export default LeftSidebar;
