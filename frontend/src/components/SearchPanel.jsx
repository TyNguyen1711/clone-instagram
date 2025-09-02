import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search as SearchIcon, X, Check } from "lucide-react";
import {
  addUserToHistorySearchApi,
  deleteAllHistorySearchApi,
  deleteUserFromHistorySearchApi,
  getSearchHistoryApi,
  searchUserApi,
} from "@/services/api/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { BlueCheck } from "./icon";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const SearchPanel = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [usersSearch, setUsersSearch] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const bufferUser = user;
  const [recentSearches, setRecenteSearches] = useState(user?.searchHistory);
  const navigate = useNavigate();
  useEffect(() => {
    setSearchQuery("");
  }, []);
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
    const response = await addUserToHistorySearchApi(userId);
    if (response.success) {
      const res = await getSearchHistoryApi();
      if (res.success) {
        const newUser = { ...user, searchHistory: res.searchHistory };
        setRecenteSearches(res.searchHistory);
        dispatch(setAuthUser(newUser));
      }
    }
    onClose();
    navigate(`/profile/${userId}`);
    setSearchQuery("");
  };
  const handlerClickDelete = async (userId) => {
    const response = await deleteUserFromHistorySearchApi(userId);
    if (response.success) {
      const res = await getSearchHistoryApi();
      if (res.success) {
        const newUser = { ...user, searchHistory: res.searchHistory };
        setRecenteSearches(res.searchHistory);
        dispatch(setAuthUser(newUser));
      }
    }
  };
  const handlerClickDeleteAll = async () => {
    const response = await deleteAllHistorySearchApi();
    if (response.success) {
      const newUser = { ...user, searchHistory: [] };
      setRecenteSearches([]);
      dispatch(setAuthUser(newUser));
    }
  };
  return (
    <div className="fixed top-0 left-[73px] w-[360px] h-screen bg-white border-r border-gray-200 z-50 rounded-r-2xl shadow-[4px_0px_14px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col h-full">
        <div className="px-3 py-5 border-b border-gray-300">
          <h2 className="text-2xl font-bold mb-8">Search</h2>
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
                <div className="flex justify-between items-center mt-4 mb-3">
                  <h3 className="font-semibold">Recent</h3>
                  <button
                    onClick={handlerClickDeleteAll}
                    className="text-blue-500 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches?.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      handlerClickUser(user._id);
                    }}
                    className="flex items-center justify-between py-2 hover:bg-gray-100 rounded-lg cursor-pointer group"
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
                      <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm">
                            {user.username}
                          </span>
                          {user.isUserBlue && (
                            <div>
                              <BlueCheck width="0.8rem" height="0.8rem" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {(user.bio || "Bio here ...") + " • "}
                          {bufferUser?.following.includes(user._id) ? (
                            <span className="text-gray-400">Following</span>
                          ) : (
                            <span className="text-gray-400">
                              {user.countFollowers} followers
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-200 rounded-full transition-opacity"
                    >
                      <X
                        onClick={() => {
                          handlerClickDelete(user._id);
                        }}
                        className="h-6 w-6 text-gray-700"
                      />
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
                                <BlueCheck width="0.8rem" height="0.8rem" />
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
