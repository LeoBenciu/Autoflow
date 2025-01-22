import { createSlice } from "@reduxjs/toolkit";

const initialState={
    savedPosts: [],
}

const postsSlice = createSlice({
    name: 'post',
    initialState,
    reducers:{
        setSavedPosts:(state,action)=>{
            state.savedPosts = action.payload;
        },
        clearSavedPosts:(state,action)=>{
            state.savedPosts = [];
        },
    }
})

export const {setSavedPosts, clearSavedPosts} = postsSlice.actions;
export default postsSlice.reducer;