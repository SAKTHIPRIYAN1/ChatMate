import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

const initialState={
    recipName:null,
    recipInter:[],
    hasRecip:false,
    recipSock:undefined,
    recipPass:undefined,
    recipId:null
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
            
            state.recipPass=action.payload.pass;
            state.recipId=action.payload.UserId;
            console.log(state.recipId);

            state.hasRecip=true;
        },
        ClearAnnonRecip:(state,action)=>{
            state.hasRecip=false;
            state.recipInter=undefined;
            state.recipInter=[];
            state.recipPass=undefined;
            state.recipId=null;
            // console.log("from store : Annonymous Recip Cleared");
        }
    }
})

export const {setAnnonymousPair,ClearAnnonRecip}=RecipSlice.actions;
export default RecipSlice.reducer;