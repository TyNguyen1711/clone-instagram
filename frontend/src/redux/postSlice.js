import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    explorePost: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setExplorePost: (state, action) => {
      state.explorePost = action.payload;
    },
  },
});
export default postSlice.reducer;
export const { setPosts, setSelectedPost, setExplorePost } = postSlice.actions;
