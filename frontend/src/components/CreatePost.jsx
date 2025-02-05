import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { createPostApi } from "../services/api/post.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
const CreatePost = ({ openCreatePost, setOpenCreatePost }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImageReview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const createPostHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("caption", caption);
    if (imagePreview) data.append("image", file);
    setLoading(true);
    const response = await createPostApi(data);
    setLoading(false);
    if (response.success) {
      setCaption("");
      setFile("");
      setImageReview("")
      dispatch(setPosts([response.post, ...posts]));
      toast.success(response.message);
      setOpenCreatePost(false);
    } else {
      toast.error("Failed !!!");
    }
  };
  const handleChangeFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImageReview(dataUrl);
    }
  };
  return (
    <Dialog open={openCreatePost}>
      <DialogContent onInteractOutside={() => setOpenCreatePost(false)}>
        <DialogHeader className="mx-auto font-semibold text-xl">
          Create New Post
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user.username}</h1>
            <span className="text-gray-500 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={handleChangeFile}
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center">
            <img
              className="w-full h-full object-cover rounded-md object-center"
              src={imagePreview}
            />
          </div>
        )}
        <Button
          onClick={() => {
            imageRef.current.click();
          }}
          className="w-fit mt-2 mx-auto hover:bg-[#258bcf] bg-[#0095f6]"
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" onClick={createPostHandler}>
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};
export default CreatePost;
