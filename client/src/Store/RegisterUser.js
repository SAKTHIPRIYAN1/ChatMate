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
            console.log("from store(userSlice) :",state.interest)
        },
        setUserSock:(state,action)=>{
            state.socketId=action.payload;
            console.log("from store(userSlice) :",state.socketId);
        },
        setUserName:(state,action)=>{
            state.name=action.payload;
            console.log("from store(userSlice) :",state.name);
        }
    },
});

export const {alter,setUserSock,setUserName} =UserRegSlice.actions;
export default UserRegSlice.reducer;