import { createSlice } from "@reduxjs/toolkit";

const initialState={
    email:null,
    id:null,
    name:null,
    accessToken:null,
    isLoggedin:false,
}

const User=createSlice({
    name:"User",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            // console.log(action.payload);
           const {email,id,name,accessToken}=action.payload;
           state.email=email;
           state.name=name;
           state.id=id;
           state.accessToken=accessToken;
           state.isLoggedin=true;
        }
    }
});

export const {setUser} =User.actions;
export default User.reducer;