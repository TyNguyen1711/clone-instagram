import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const handleChangeInput = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText.trim());
    } else {
      setText("");
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div>
            <img
              className="w-full h-full object-cover rounded-l-lg"
              src="https://cdn.pixabay.com/photo/2024/12/07/17/47/autumn-9251331_640.jpg"
            />
          </div>

          <div className="flex flex-col w-1/2 justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 p-4">
                <Link>
                  <Avatar>
                    <AvatarImage src="" alt="post_image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">Username</Link>
                  {/* <span className="text-gray-600 text-sm">Bio here ...</span> */}
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
            <div className="flex-1 p-4 max-h-96 overflow-y-auto">comment</div>
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
