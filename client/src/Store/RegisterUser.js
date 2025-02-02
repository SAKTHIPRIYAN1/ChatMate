import { createSlice } from "@reduxjs/toolkit";

const initialState={
    name:"",
    interest:[],
    socketId:undefined
};

const UserRegSlice=createSlice({
    name:"UserReg",
    initialState,
    reducers:{
        alter:(state,action)=>{
            state.interest=action.payload;
        },
        setUserSock:(state,action)=>{
            state.socketId=action.payload;
        },
        setUserName:(state,action)=>{
            state.name=action.payload;
        }
    },
});

export const {alter,setUserSock,setUserName} =UserRegSlice.actions;
export default UserRegSlice.reducer;