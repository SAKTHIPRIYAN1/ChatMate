import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isVisi:false
};

const AnnonDesSlice=createSlice({
    name:"AnnonDes",
    initialState:initialState,
    reducers:{
        setDesVisible:(state,action)=>{
            state.isVisi=action.payload;
        }
    }
})
export const {setDesVisible} =AnnonDesSlice.actions;
export default AnnonDesSlice.reducer;