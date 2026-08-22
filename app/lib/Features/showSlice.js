// lib/features/showSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
message:"",
isShow: false,
type:""
};

const showSlice = createSlice({
name: "show",
initialState,
reducers: {
    setShow: (state , action) => {
    state.message=action.payload.message
    state.isShow = true;
    state.type=action.payload.type
    },
    hideShow: (state) => {
    state.isShow = false;
    },
},
});

export const { setShow , hideShow } = showSlice.actions;
export default showSlice.reducer;