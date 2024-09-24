import { createSlice } from "@reduxjs/toolkit";

const initialState={
    name:undefined,
    interest:[],
    scoketId:undefined
};

const UserRegSlice=createSlice({
    name:"UserReg",
    initialState,
    reducers:{
        alter:(state,action)=>{
            state.interest=action.payload;
        }
    },
});

export const {alter} =UserRegSlice.actions;
export default UserRegSlice.reducer;