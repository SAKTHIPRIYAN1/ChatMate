import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKURL;
import { selectAuth } from "./AuthUser";
import { act } from "react";
const initialState={
    name:null,
    Auth:null,
    chatId:null,
    load:false,
    profilePic:null,
    Messages:[],
    isEmpty:true,
    isAboutOpen:false,
};


export const GetContactMessages = createAsyncThunk(
    "Contact/GetContactMessages",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const chatId = state.Contact.chatId; 
            const Auth=selectAuth(state);
            console.log("Chat ID:", chatId);
            if(!chatId){
                return rejectWithValue("No chat");
            }

            const res = await axios.get(`${apiUrl}/Message/getMessage/${chatId}`, {
                withCredentials: true,
            });

            const Mess=res.data.mess;
            const Messages=[];
            for(let i=0;i<Mess.length;i++){
                        const isYou=Auth==Mess[i].sender;
                        const mess=Mess[i].message;
                        console.log({isYou,mess});
                        Messages.push({isYou,mess,isFile:Mess[i].isFile,path:Mess[i].filePath,filename:Mess[i].fileName});
            }

            return Messages;
        } catch (err) {
            console.error(err);
            return rejectWithValue("Error occurred while retrieving messages");

            
        }
    }
);

// export const GetContactPic=createAsyncThunk("Contact/GetContactMessages",async (_, { getState, rejectWithValue }) => {
//     try{
//         const state=getState();
//         const Auth=state.Contact.Auth;
//         if(!Auth){
//             return rejectWithValue("No Auth");
//         }
//         const res = await axios.post(`${apiUrl}/profile/getPic`,{user_id:Auth}, {
//             withCredentials: true,
//         });

//         const {profile}=res.data;
//         return profile;

//     }catch(err){
//         console.log(err);
//         return rejectWithValue("Error occurred while retrieving ");
//     }
// })


const ContactSlice= createSlice(
   {
    name:"Contact",
    initialState,
    reducers:{
        setContact:(state,action)=>{
            console.log(action.payload)
            state.name=action.payload.name;
            state.Auth=action.payload.Auth;
            state.chatId=action.payload.chatId;
            console.log("setting Contact!!!");
            console.log("pld:::action:",action.payload,action.payload.profile);
            state.profilePic=action.payload.profile;
            state.isEmpty=false;
        },
        setMessages:(state,action)=>{
            state.Messages.push(action.payload);
            console.log(action.payload);
        },
        clearMess:(state,action)=>{
            state.Messages=[];
        }
        ,clearContact: (state) => {
            state.name = null;
            state.Auth = null;
            state.chatId = null;
            state.load = false;
            state.profilePic = null;
            state.Messages = [];
            state.isEmpty = true;
        },
        alterAboutOpen:(state,action)=>{
            state.isAboutOpen=!state.isAboutOpen;
            
        },
        setAbout:(state,action)=>{
            state.isAboutOpen=true;
            console.log(state.isAboutOpen);
        },
        setConName:(state,action)=>{
            state.name=action.payload;
        }
    },

    extraReducers:(builder)=>{
        builder
             .addCase(GetContactMessages.pending, (state) => {
                        state.load=true;
            })
             .addCase(GetContactMessages.fulfilled, (state, action) => {
                        console.log(action.payload);
                        state.Messages=action.payload;
                        console.log(state.Messages);
                       state.load=false;
            })
             .addCase(GetContactMessages.rejected, (state, action) => {
                       state.load=false;
                    
            })

    }
   }
);
export const {setContact,setAbout,setConName,alterAboutOpen,setMessages,clearMess,clearContact}=ContactSlice.actions;
export default ContactSlice.reducer;