import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKURL;
import { selectAuth } from "./AuthUser";
const initialState={
    name:null,
    Auth:null,
    chatId:null,
    load:false,
    Messages:[],
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
        },
        setMessages:(state,action)=>{
            state.Messages.push(action.payload);
            console.log(state.Messages);
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
                    
            });
    }
   }
);
export const {setContact,setMessages}=ContactSlice.actions;
export default ContactSlice.reducer;