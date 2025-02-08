import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { editProfileApi } from "@/services/api/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const imageRef = useRef();
  const [input, setInput] = useState({
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChangeAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingAvatar(true);
    const data = new FormData();
    data.append("profilePicture", file);

    const response = await editProfileApi(data);
    if (response.success) {
      toast.success(response.mes);
      dispatch(
        setAuthUser({
          ...user,
          profilePicture: response.user.profilePicture,
        })
      );
    }
    setLoadingAvatar(false);
  };
  const handlerEditProfile = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("bio", input.bio);
    data.append("gender", input.gender);
    const response = await editProfileApi(data);
    setLoading(false);
    if (response.success) {
      toast.success(response.mes);
      dispatch(
        setAuthUser({
          ...user,
          bio: response.user.bio,
          gender: response.user.gender,
        })
      );
      navigate(`/profile/${user._id}`);
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h1 className="font-bold text-2xl mt-5">Edit profile</h1>
      </div>
      <div className="flex items-center justify-between my-6 bg-gray-100 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <Avatar>
            {loadingAvatar ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <AvatarImage src={user?.profilePicture} alt="img" />
            )}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="font-bold text-sm">{user?.username}</div>
            <div className="text-gray-500">{user?.bio || "Bio here ..."}</div>
          </div>
        </div>
        <div className="flex items-center">
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={handleChangeAvatar}
          />
          <Button
            variant="secondary"
            className="h-8 bg-[#0095F6] text-white hover:bg-[#318bc7]"
            onClick={() => {
              imageRef.current.click();
            }}
          >
            Change photo
          </Button>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg">Bio</h1>
        <Textarea
          value={input.bio}
          name="bio"
          className="focus-visible:ring-transparent mt-2"
          onChange={(e) => {
            setInput({ ...input, bio: e.target.value });
          }}
        />
      </div>

      <div className="mt-4">
        <h1 className="font-bold text-lg mb-2">Gender</h1>
        <Select
          defaultValue={input.gender ? input.gender : ""}
          onValueChange={(value) => setInput({ ...input, gender: value })}
        >
          <SelectTrigger className="w-full h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end mt-4">
        {loading ? (
          <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Please wait
          </Button>
        ) : (
          <Button
            className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            onClick={() => {
              handlerEditProfile();
            }}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};
export default EditProfile;
