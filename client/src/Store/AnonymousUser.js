import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

const initialState={
    recipName:undefined,
    recipInter:[],
    hasRecip:false,
    recipSock:undefined
}
export 
const RecipSlice=createSlice({
    name:"AnnRecip",
    initialState,
    reducers:{
        setAnnonymousPair:(state,action)=>{
            const {interest,name,socketid}=action.payload;
            // console.log(action.payload)
            state.recipInter=interest;
            state.recipName=name;
            state.recipSock=socketid;
            console.log("from store(annonymous):",state.recipInter,"::",interest,"::",state.recipSock);
            
            state.hasRecip=true;
        },
        ClearAnnonRecip:(state,action)=>{
            state.hasRecip=false;
            state.recipInter=undefined;
            state.recipInter=[];
            
            // console.log("from store : Annonymous Recip Cleared");
        }
    }
})

export const {setAnnonymousPair,ClearAnnonRecip}=RecipSlice.actions;
export default RecipSlice.reducer;