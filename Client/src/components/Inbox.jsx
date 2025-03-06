import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Msg from "./Msg";
const Inbox=({socket,inbox,event})=>{

    const room=useSelector(store=>store.room)
    const [msg,setMsg]=useState("");
    const messagesEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [inbox]);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div className="w-[25%] h-full p-2 rounded">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg   w-full h-full rounded relative p-0">
                        <div className="h-[92%] overflow-y-auto custom-scrollbar p-2">
                        {inbox.length > 0 ? 
    inbox.map((e, i) => (
        <Msg key={i} username={e.sentBy} guess={e.guess} msg={e.msg} />
    )) : null
}
<div ref={messagesEndRef} />
                        </div>
                        <div className="flex absolute bottom-0 w-[98%] m-1 h-[8%]">  
                        <input onKeyDown={(e)=>{
                            if(e.key==="Enter"&&msg.trim().length){
                                if(socket){
                                    socket.emit(`send${event}`,{roomId:room.roomId,message:{padam:msg}});
                                    setMsg("");
                                }
                            }
                        }} value={msg} onChange={(e)=>{setMsg(e.target.value)}} type="text" className="flex w-[80%]  rounded-l left-0 bg-white/10 backdrop-blur-2xl text-black font-semibold  placeholder:text-xs p-1 outline-none" placeholder="Type your guess here..."></input>
                        <div className="flex justify-center w-[20%] items-center  bg-white/10 backdrop-blur-2xl  p-1 rounded-r">
                        <button onClick={(e)=>{
                            if(socket&&msg.trim().length){
                                socket.emit(`send${event}`,{roomId:room.roomId,message:{padam:msg}});
                                setMsg("");
                            }
                        }} className="bg-blue-400 rounded p-2 text-white font-semibold">Send</button>
                        </div>
                        </div>
                    </div>
                </div>
    )
}
export default Inbox;