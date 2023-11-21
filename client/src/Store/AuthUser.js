import { createSlice } from "@reduxjs/toolkit";
import { useLoading } from "../components/Loadingcontext";
import RandomPass from "../CustomHooks/RandomPass";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKURL;
const imgUrl=import.meta.env.VITE_IMG;


const initialState={
    email:null,
    id:null,
    name:null,
    accessToken:null,
    isLoggedin:false,
    Auth:null,
    AnnonPass:null,
    load:true,
    profilePic:null,
}

export const getUserData = createAsyncThunk(
    'User/getUserData', // Name of the thunk
    async (_, { dispatch, rejectWithValue }) => {
      try {
        console.log("Authh Call Initiated....");
        const res = await axios.post(
          `${apiUrl}/preauth`, 
          { Purpose: "login" }, 
          { withCredentials: true }
        );
  
        console.log(res.data);
  
        if (res.data.data) {
          // Dispatch actions if needed
          dispatch(setUser(res.data.data));
          dispatch(setUserAuth(res.data.data.id)); 
          return res.data.data; 
        } else {
          return rejectWithValue('No user data found.');
        }
      } catch (error) {
          try{
            console.log("heyy triggered....");
              const data =await RandomPass.GenerateRandomPass();

              const {Auth,accessToken}=data;
              dispatch(setUserAuth(Auth)); 
              const val ={code:401,Auth,accessToken};
              return val;
          }
          catch(err){
              console.log(err);
              return rejectWithValue('No user data found.');
          }
      }
});

// for generate RndomPass...
export const generateAuthAsync = createAsyncThunk("auth/generate", async () => {
  return await RandomPass.GenerateRandomPass();
});


const User=createSlice({
    name:"User",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            // console.log(action.payload);
           const {email,id,name,accessToken,profile}=action.payload;
           state.email=email;
          
           state.name=name.toLowerCase();
           state.id=id;
           state.accessToken=accessToken;
           state.isLoggedin=true;
           if(profile){
              state.profilePic=imgUrl+"/"+profile;
              console.log("prz;",profile);
           }
           console.log(profile);
        },
        setUserAuth:(state,action)=>{
            console.log(action.payload);
            state.Auth=action.payload;
            // console.log("Auth:",state.Auth);
        },
        setUserImage:(state,action)=>{
          state.profilePic=action.payload;
        },
        setNameAccess:(state,action)=>{
          state.name=action.payload.name;
          state.accessToken=action.payload.accessToken;
        },
        ClearUser:(state,action)=>{
         state.email=null;
          state.id=null;
          state.name=null;
          state.accessToken=null;
          state.isLoggedin=false;
          state.Auth=null;
         state.AnnonPass=null;
          state.load=true;
          state.profilePic=null;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getUserData.pending, (state) => {
            state.load=true;
          })
          .addCase(getUserData.fulfilled, (state, action) => {
            console.log(action.payload);
            if(action.payload.code){
              state.AnnonPass=action.payload.Auth;
              state.accessToken=action.payload.accessToken;
              state.load=false;
            }
            else{
              const {email,id,name}=action.payload;
              state.id=id;
              state.name=name.toLowerCase();
              state.email=email;
              state.load=false;
            }
          })
          .addCase(getUserData.rejected, (state, action) => {
            state.load=false;
          })
          .addCase(generateAuthAsync.fulfilled, (state, action) => {
            const {accessToken,Auth}=action.payload;
            state.accessToken=accessToken;
            state.Auth=Auth;
          })
      },
});

export const {setUser,setUserAuth,ClearUser,setUserImage} =User.actions;
export const selectAuth = (state) => state.User.Auth;
export default User.reducer;