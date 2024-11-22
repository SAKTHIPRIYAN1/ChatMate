import { createSlice } from "@reduxjs/toolkit";

const initialState={
    messages:[]
};

const AnnonMess=createSlice({
    name:"AnnonMess",
    initialState:initialState,
    reducers:{
        addNewAnnonMess:(state,action)=>{
        //    console.log(action.payload)
           state.messages.push(action.payload);
        //    console.log(state.messages);
        },
        clearAnnonMess:(state,action)=>{
            state.messages=[];
        }
    }
});


export const {addNewAnnonMess,clearAnnonMess} =AnnonMess.actions;
export default AnnonMess.reducer;