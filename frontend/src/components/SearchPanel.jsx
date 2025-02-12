import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search as SearchIcon, X, Check } from "lucide-react";
import { searchUserApi } from "@/services/api/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "@/redux/authSlice";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const SearchPanel = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [usersSearch, setUsersSearch] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const bufferUser = user;
  const [recentSearches] = useState([
    {
      id: 1,
      username: "wag",
      name: "The #1 App for Pet Parents",
      followers: "131K followers",
      verified: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      username: "keria_minseok",
      name: "류민석",
      status: "Following",
      verified: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 3,
      username: "t1_oner",
      name: "현준",
      status: "Following",
      verified: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 4,
      username: "t1_gumayusi",
      name: "이민형",
      status: "Following",
      verified: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 5,
      username: "cristiano",
      name: "Cristiano Ronaldo",
      followers: "649M followers",
      verified: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 6,
      username: "faker",
      name: "Faker(페이커)",
      status: "Following",
      verified: true,
      avatar: "/api/placeholder/32/32",
    },
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDataSearch = async () => {
      if (!searchQuery.trim()) return;
      const response = await searchUserApi(searchQuery);
      if (response.success) {
        setUsersSearch(response.users);
      }
    };
    fetchDataSearch();
  }, [searchQuery]);
  if (!isOpen) return null;
  const handlerClickUser = async (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };
  return (
    <div className="fixed top-0 left-[73px] w-[397px] h-screen bg-white border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Search</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 pb-6">
            {!searchQuery ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Recent</h3>
                  <button className="text-blue-500 text-sm font-medium">
                    Clear all
                  </button>
                </div>
                {recentSearches.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 hover:bg-gray-100 rounded-lg cursor-pointer group px-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage
                          src={user.profilePicture}
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm">
                            {user.username}
                          </span>
                          {user.verified && (
                            <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {user.name}
                          {(user.status || user.followers) && " • "}
                          <span className="text-gray-400">
                            {user.status || user.followers}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <div>
                {usersSearch?.length > 0 ? (
                  usersSearch.map((user) => (
                    <div
                      onClick={() => {
                        handlerClickUser(user._id);
                      }}
                      key={user._id}
                      className="flex items-center justify-between py-2 hover:bg-gray-100 rounded-lg cursor-pointer group px-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarImage
                            src={user.profilePicture}
                            alt={user.username}
                          />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">
                              {user.username}
                            </span>
                            {user.isUserBlue && (
                              <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">
                            {user.bio || "Bio here ...  • "}
                            {bufferUser.following.includes(user._id) ? (
                              <span className="text-gray-400">Following</span>
                            ) : (
                              <span className="text-gray-400">
                                {user.followers.length} followers
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No results found.</p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SearchPanel;
