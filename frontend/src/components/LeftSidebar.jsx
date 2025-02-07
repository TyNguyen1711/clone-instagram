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
import { setAuthUser } from "@/redux/authSlice";
import { setPosts } from "@/redux/postSlice";
import { setSelectedPost } from "@/redux/postSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
const LeftSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
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
      dispatch(setSelectedPost(null));
      navigate("/login");
    }
  };
  const handleCreatePost = async () => {
    setOpenCreatePost(true);
  };
  const sidebarHandler = async (textType) => {
    console.log(textType);
    if (textType === "Logout") {
      handleLogout();
    } else if (textType === "Create") {
      handleCreatePost();
    } else if (textType === "Profile") {
      navigate(`/profile/${user._id}`);
    }
  };
  return (
    <div className="fixed top-0 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div>
        <h1 className="font-bold my-4 ml-5 text-xl mb-4">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center p-5 hover:bg-gray-100 cursor-pointer"
                onClick={() => sidebarHandler(item.text)}
              >
                <div className="mr-2">{item.icon}</div>
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
