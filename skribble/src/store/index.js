import {configureStore} from "@reduxjs/toolkit"
import roomSlice from "./room";
import wordSlice from "./words";
const store=configureStore({
    reducer:{
        room:roomSlice.reducer,
        words:wordSlice.reducer 
    }
})
export default store;