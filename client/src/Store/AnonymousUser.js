import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

const initialState={
    recipName:undefined,
    recipInter:undefined
}

const RecipSlice=createSlice({
    name:"AnnRecip",
    initialState,
    reducers:{}
})

export default RecipSlice.reducer;