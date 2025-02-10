import { useContext, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {SocketContext} from "../store/SocketProvider";
import { useDispatch, useSelector, useStore } from "react-redux";
import { roomActions } from "../store/room";
import Card from "../components/Card";
import Msg from "../components/Msg";
import { useNavigate } from "react-router-dom";
const Lobby=()=>{
    const [msg,setMsg]=useState("");
    const dis=useDispatch();
    const nav=useNavigate();
    const socket=useContext(SocketContext);
    const room=useSelector(store=>store.room); 
    const [inbox,setInbox]=useState([]);
    const [copied,setCopy]=useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [inbox]);

    const handleCopy=()=>{
        navigator.clipboard.writeText(room.roomId).then(
            ()=>{
                setCopy(true);
                setTimeout(()=>setCopy(false),3000);
            }
        ).catch((e)=>console.log(e));
    };
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(()=>{
        if(socket){
            socket.on("recieveMessage",(salaar)=>{
                setInbox((prevInbox) => [...prevInbox, salaar]);
            });
            socket.on("gameStarted",(data)=>{
                dis(roomActions.setUsers(data.room));
                nav("/AataAarambam");
            })
        };
        return ()=>{
            if(socket)
            socket.off("recieveMessage");
        }
    },[socket])
    return (
        <>
            <div className="w-screen h-screen">
                <div className="w-full p-5 h-full gap-1 justify-between items-center flex">
                    {
                        <div className="custom-scrollbar overflow-y-auto break-words rounded w-[25%] h-full flex flex-col gap-1">
                        {room?.room?.users?.map((e,i)=>{
                            return <Card you={room.profile?.id} key={i} id={e.id} index={i}>{e.userName}</Card>
                        })}
                        </div>
                    }
                <div className="w-[50%] h-full p-2 relative">
                <div className="w-full">
                    <div className="w-full flex justify-between items-center bg-pink-100 p-2">
                        <div className="flex">
                        <img src="https://skribbl.io/img/setting_1.gif"/>
                        <h1>Players</h1>
                        </div>
                        <select onChange={(e)=>{
                            if(socket){
                                socket.emit("settingsChange",{roomId:room.roomId,settings:{
                                    type:"Aatagaallu",
                                    Enti:e.target.value
                                }});
                            }
                        }} value={room.room?.settings?.players}  className="bg-white w-[50%] text-center">
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </div>
                    <div className="w-full flex justify-between items-center bg-pink-100 p-2">
                        <div className="flex">
                        <img src="https://skribbl.io/img/setting_2.gif"/>
                        <h1>Draw Time</h1>
                        </div>
                        <select onChange={(e)=>{
                            if(socket){
                                socket.emit("settingsChange",{roomId:room.roomId,settings:{
                                    type:"TIMING",
                                    Enti:e.target.value
                                }});
                            }
                        }}  value={room.room?.settings?.drawTime}  className="bg-white w-[50%] text-center">
                            <option>15</option>
                            <option>20</option>
                            <option>30</option>
                            <option>40</option>
                            <option>50</option>
                            <option>60</option>
                            <option>70</option>
                            <option>80</option>
                            <option>90</option>
                            <option>100</option>
                            <option>120</option>
                            <option>140</option>
                            <option>160</option>
                        </select>
                    </div>
                    <div className="w-full flex justify-between items-center bg-pink-100 p-2">
                        <div className="flex">
                        <img src="https://skribbl.io/img/setting_3.gif"/>
                        <h1>Rounds</h1>
                        </div>
                        <select onChange={(e)=>{
                            if(socket){
                                socket.emit("settingsChange",{roomId:room.roomId,settings:{
                                    type:"Aatalu",
                                    Enti:e.target.value
                                }});
                            }
                        }} value={room.room?.settings?.rounds}   className="bg-white w-[50%] text-center">
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-0 absolute bottom-0 w-full left-0  ">
                <button onClick={()=>{
                    if(socket){
                        socket.emit("startGame",{roomId:room.roomId});
                    }
                }} className="bg-green-500 p-3 w-[75%] rounded-tl text-white font-bold text-xl">Start</button>
                <button onClick={handleCopy} className="w-[25%] rounded-tr cursor-pointer flex justify-center items-center text-black font-bold bg-gray-400 ">
                            Invite{!copied?<img src="/copy.svg"></img>:<img src="/copied.svg"></img>}
                </button>
                </div>
                </div>
                <div className="w-[25%] h-full p-2 rounded">
                    <div className="bg-gray-400 w-full h-full rounded relative p-0">
                        <div className="h-[92%] overflow-y-auto custom-scrollbar p-2">
                        {inbox.length > 0 ? 
    inbox.map((e, i) => (
        <Msg key={i} username={e.sentBy} msg={e.message} />
    )) : null
}
<div ref={messagesEndRef} />
                        </div>
                        <div className="flex absolute bottom-0 w-[98%] m-1 h-[8%]">  
                        <input onKeyDown={(e)=>{
                            if(e.key==="Enter"&&msg.trim().length){
                                if(socket){
                                    socket.emit("sendMessage",{roomId:room.roomId,message:{sentBy:room.profile.userName,message:msg}});
                                    setMsg("");
                                }
                            }
                        }} value={msg} onChange={(e)=>{setMsg(e.target.value)}} type="text" className="flex w-[80%]  rounded-l left-0 bg-white placeholder:text-xs p-1 outline-none" placeholder="Type your guess here..."></input>
                        <div className="flex justify-center w-[20%] items-center bg-white  p-1 rounded-r">
                        <button onClick={(e)=>{
                            if(socket&&msg.trim().length){
                                socket.emit("sendMessage",{roomId:room.roomId,message:{sentBy:room.profile.username,message:msg}});
                                setMsg("");
                            }
                        }} className="bg-blue-400 rounded p-1 text-white font-semibold">Send</button>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}
export default Lobby;
