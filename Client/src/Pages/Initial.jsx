import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { SocketContext } from "../store/SocketProvider";
import {useDispatch, useSelector} from "react-redux"
import { roomActions } from "../store/room";
import { ToastContainer, toast } from "react-toastify";
import cx from "clsx"
import Scorpio from "../components/Scorpio";
function CustomNotification({ closeToast, data, toastProps }) {
    const isColored = toastProps.theme === "colored";
  
    return (
      <div className="flex flex-col w-full">
        <h3
          className={cx(
            "text-sm font-semibold",
            isColored ? "text-white" : "text-zinc-800"
          )}
        >
          {data.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm">{data.content}</p>
          <button
            onClick={closeToast}
            className={cx(
              "ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95]",
              isColored ? "bg-transparent" : "bg-zinc-900"
            )}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
 export const notify=(data)=>{
    toast.error(CustomNotification, {
        data: {
          title: `Invalid ${data}`,
          content: `${"valid " +data+ " is required"}`,
        },
        ariaLabel: "Something went wrong",
        autoClose: true,
        progress: 0,
        icon: false,
        theme: "colored",
      });
}
const CreateRoom=()=>{
    const nav=useNavigate();
    const socket=useContext(SocketContext);
    const [name,setName]=useState("");
    const room=useSelector(store=>store.room); 
    const [roomId,setroomId]=useState("");
    const dis=useDispatch();
    return (
        <>
        <ToastContainer />
        <div className="w-screen h-screen bg-gradient-to-r from-blue-500 to-green-500 relative  flex items-center justify-center">
            <div className="absolute top-2 left-2">
            <Scorpio></Scorpio> 
            </div>
             <form onSubmit={(e)=>{
                e.preventDefault()
            }}>
            <div className="border flex flex-col gap-5 border-transparent bg-gradient-to-br from-yellow-200/50 to-pink-400/50 rounded-lg text-white p-10">
            <label className="flex flex-col gap-1">
            Enter Your Name
            <input value={name} onChange={(e)=>setName(e.target.value)} required className="bg-gray-100 placeholder:text-gray-600 text-black p-2 rounded outline-0" placeholder="Enter your name"></input>
            </label>
            <div className="flex flex-col items-start justify-center gap-2">
            <h1>Join a room?</h1>
            <input value={roomId} onChange={(e)=>setroomId(e.target.value)} className="bg-gray-100 placeholder:text-gray-600 text-black p-2 rounded outline-0" placeholder="Enter roomId"></input>
            <button onClick={(e)=>{
                if(socket&&roomId.trim()&&name.trim().length>3){
                    socket.emit("joinRoom",{userName:name,roomId:roomId});
                    socket.on("success",(data)=>{
                        dis(roomActions.setRoom({room:data.room,roomId:roomId}));
                        dis(roomActions.setProfile({profile:data.profile}));  
                        nav(`/room/${roomId}`);
                    })          
                }
                else{
                if(!(name.trim().length>3)){
                    notify("User Name")
                }
                if(!roomId.trim().length){
                    notify("room Id");
                }}
            }} className="bg-white m-0.5 cursor-pointer font-medium active:bg-gray-300 text-black rounded p-1 w-[50%]">Join</button>
            </div>
            <hr></hr>
            <button 
                onClick={(e)=>{
                    if(socket&&name.trim().length>3){
                        socket.emit("createRoom",{userName:name});
                        socket.on("roomCreated",(data)=>{
                            dis(roomActions.setRoom({roomId:data.roomId,room:data.room}));
                            dis(roomActions.setProfile({profile:data.profile}));
                            nav(`/room/${data.roomId}`);
                        })
                    }
                    else{
                      if(!(name.trim().length>3)){
                        notify("User Name")
                    }
                    }
                }}
                className="bg-white text-black font-extrabold cursor-pointer p-3 rounded">Create Room</button>
            </div>
            </form>
        </div>
                </>
    )
}
export default CreateRoom