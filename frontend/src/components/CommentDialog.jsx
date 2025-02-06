import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { commentPostApi } from "@/services/api/post.js";
import { setPosts } from "@/redux/postSlice.js";
import { toast } from "sonner";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost } = useSelector((state) => state.post);
  const { posts } = useSelector((state) => state.post);
  const [comment, setComment] = useState(selectedPost.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  });
  const handleChangeInput = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText.trim());
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    const response = await commentPostApi(selectedPost._id, text);
    if (response.success) {
      toast.success(response.message);
      setComment([response.comment, ...comment]);
      const updatePostsData = posts.map((p) =>
        p._id === selectedPost._id
          ? {
              ...p,
              comments: [response.comment, ...p.comments],
            }
          : p
      );
      setText("");
      dispatch(setPosts(updatePostsData));
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        {/* Rest of your component remains the same */}
        <div className="flex flex-1">
          <div>
            <img
              className="w-full h-full object-cover rounded-l-lg"
              src={selectedPost?.image}
              alt="post"
            />
          </div>

          <div className="flex flex-col w-2/3 justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 p-4">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author.profilePicture}
                      alt="profile"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger>
                  <MoreHorizontal className="cursor-pointer mr-3" />
                </DialogTrigger>
                <DialogContent>
                  <Button variant="ghost" className="text-[#ED4956] font-bold">
                    Unfollow
                  </Button>
                  <Button variant="ghost">Add to favorites</Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 p-4 max-h-96 overflow-y-auto">
              {comment.map((comment, index) => (
                <Comment key={index} comment={comment} />
              ))}
            </div>
            <div className="p-4 flex items-center">
              <input
                type="text"
                placeholder="Add a comment"
                className="outline-none w-full border p-2 rounded-sm mr-2"
                value={text}
                onChange={handleChangeInput}
              />
              <Button
                disabled={!text.trim()}
                variant="ghost"
                className="border"
                onClick={sendMessageHandler}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
