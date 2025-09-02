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

import {
  IconCreatePost,
  IconExplore,
  IconHeart,
  IconHome,
  IconInstagram,
  IconMessage,
  IconReels,
  LogoInstagramIcon,
} from "./icon/index.jsx";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa6";
import CreatePost from "./CreatePost";
import { setMessages } from "@/redux/chatSlice";
import SearchPanel from "./SearchPanel.jsx";
import { IconSearch } from "./icon/index.jsx";
const LeftSidebar = () => {
  const { user, selectedUser } = useSelector((state) => state.auth);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [type, setType] = useState("Home");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapsibleRoutes = ["Search", "Messages", "Notifications"];

  const sidebarItems = [
    {
      icon:
        type === "Home" ? (
          <IconHome width={26} height={26} />
        ) : (
          <GoHome size={26} />
        ),
      text: "Home",
    },
    { icon: <IconSearch width={25} height={25} />, text: "Search" },
    { icon: <IconExplore width={25} height={25} />, text: "Explore" },
    { icon: <IconMessage width={25} height={25} />, text: "Messages" },
    { icon: <IconReels width={25} height={25} />, text: "Reels" },
    { icon: <IconHeart width={25} height={25} />, text: "Notifications" },
    { icon: <IconCreatePost width={25} height={25} />, text: "Create" },
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
      setIsSearchOpen(false);
      handleCreatePost();
    } else if (textType === "Profile") {
      setIsSearchOpen(false);
      navigate(`/profile/${user._id}`);
    } else if (textType === "Home") {
      setIsSearchOpen(false);
      navigate("/");
    } else if (textType === "Messages") {
      setIsSearchOpen(false);
      navigate("/chat");
    } else if (textType === "Search") {
      setIsSearchOpen(!isSearchOpen);
    } else if (textType === "Explore") {
      setIsSearchOpen(false);
      navigate("/explore");
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen border-r border-gray-300 transition-all duration-300 ease-in-out flex flex-col border-r border-gray-1 
      ${isCollapsed ? "w-[73px]" : "w-60"}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex justify-center items-center">
            <div
              onClick={() => {
                setIsSearchOpen(false);
                navigate("/");
              }}
              className="flex justify-center items-center cursor-pointer py-5"
            >
              {!isCollapsed ? (
                <LogoInstagramIcon className={`transition-transform`} />
              ) : (
                <div
                  onClick={() => {
                    setIsCollapsed(false);
                  }}
                  className="p-4"
                >
                  <IconInstagram width={24} height={24} />
                </div>
              )}
            </div>
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
                  <span className="ml-3 text-[16px] whitespace-nowrap">
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
      <div className="transition-all">
        <SearchPanel
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
      <div></div>
    </>
  );
};

export default LeftSidebar;
