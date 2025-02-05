import React from "react";
import Post from "./Post.jsx";
import { useSelector } from "react-redux";
const Posts = () => {
  const {posts} = useSelector(state => state.post)
  return (
    <div>
        {
            posts.map((post, index) => {
                return <div className="" key={index}>
                    <Post post={post} />
                </div>
            })
        }
    </div>
  );
};

export default Posts;
