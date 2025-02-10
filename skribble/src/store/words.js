import { createSlice } from "@reduxjs/toolkit";
const wordSlice=createSlice({
    name:"Words",
    initialState:[],
    reducers:{
        addWords:(state,action)=>{
            console.log(action.payload);
            return action.payload;
        },
        removeWords:(state,action)=>{
            return []
        }
    }
});
export const wordActions=wordSlice.actions;
export default wordSlice;