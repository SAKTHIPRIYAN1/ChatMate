import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

const initialState={
    recipName:undefined,
    recipInter:undefined,
}
export 
const RecipSlice=createSlice({
    name:"AnnRecip",
    initialState,
    reducers:{
        setAnnonymousPair:(state,action)=>{
            const {inter,name}=action.payload;
            state.recipInter=inter;
            state.name=name;
        }
    }
})

export const {setAnnonymousPair}=RecipSlice.actions;
export default RecipSlice.reducer;