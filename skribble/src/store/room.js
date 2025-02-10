import {createSlice} from "@reduxjs/toolkit"
const roomSlice=createSlice({
    name:"Room",
    initialState:{room:{},roomId:"",profile:{}},
    reducers:{
        setRoom:(state,action)=>{
            console.log(action.payload)
            return {...state,room:action.payload.room,roomId:action.payload?.roomId};
        },
        setProfile:(state,action)=>{
            return {...state,profile:action.payload.profile}
        },
        setUsers:(state,action)=>{
            return {...state,room:action.payload}
        }
    }
})
export default roomSlice;
export const roomActions=roomSlice.actions;