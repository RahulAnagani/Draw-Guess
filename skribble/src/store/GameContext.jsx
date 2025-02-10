import { createContext, useContext, useEffect, useState } from "react"
import { SocketContext } from "./SocketProvider";
import { roomActions } from "./room";
import { useDispatch } from "react-redux";
import{notify} from "../Pages/Initial"
import Select from "../components/Select";
import { wordActions } from "./words";
const GameContextWrapper=({children})=>{
    const dis=useDispatch();
    const socket=useContext(SocketContext);
    useEffect(() => {
            if (socket) {
                socket.on("userJoined", (data) => {
                    dis(roomActions.setUsers(data.room));
                });
                socket.on("userLeft", (data) => {
                    console.log(data.users);
                    dis(roomActions.setUsers(data.room));
                });
                socket.on("error",(data)=>{
                    notify(data.thing)
                    console.log(data);
                });
                socket.on("settingsChange",(data)=>{
                console.log(data.room.settings);
                    dis(roomActions.setUsers(data.room))
                });
                socket.on("Enchuko",(data)=>{
                    dis(wordActions.addWords(data.data));
                });
                socket.on("NaaIshtam",(data)=>{
                    dis(wordActions.removeWords());
                    console.log(data.data);
                });
            }
            return () => {
                if (socket) {
                    socket.off("userJoined");
                    socket.off("userLeft");
                    socket.off("settingsChange");
                    socket.off("Enchuko");
                    socket.off("NaaIshtam");
                }
            };
        }, [socket]);
    return (
        <div className="relative w-screen h-screen">
            {children}
        </div>
    )
}
export default GameContextWrapper