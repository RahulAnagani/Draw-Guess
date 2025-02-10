import { Children, createContext, useEffect, useState } from "react"
import {io} from "socket.io-client"
export const SocketContext=createContext();
const SocketProvider=({children})=>{
    const [socket,setSocket]=useState(null);
    const [words,setWords]=useState([]  )
    useEffect(()=>{
        const socket=io(import.meta.env.VITE_API_URL);
        socket.on("connect",()=>{
            console.log(`Connected to a socket with id : ${socket.id}`);
            setSocket(socket);
        });
        return ()=>{
            console.log("Disconnecting the socket");
            setSocket(null);
            socket.disconnect();
        }
    },[])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export default SocketProvider