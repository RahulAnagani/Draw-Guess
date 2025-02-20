import { useContext, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { SocketContext } from "../store/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { roomActions } from "../store/room";
import Select from "./Select";
import Inbox from "./Inbox";
import Timer from "./Timer";
import Points from "./Points";

const DrawingBoard = () => {
    const dis = useDispatch();
    const room = useSelector(store => store.room);
    const canvasRef = useRef();
    const [isDrawing, setDrawing] = useState(false);
    const [color,setColor]=useState("#000000");
    const socket = useContext(SocketContext);
    const words=useSelector(store=>store.words);
    const [inbox,setInbox]=useState([])
    const [lineWidth,setLineWidth]=useState(3);
    
    useEffect(()=>{
        if(socket){
            socket.on("Cheppadu",(salaar)=>{
                setInbox((prevInbox) => [...prevInbox,salaar]);
            });
            socket.on("CheppalaniAnukunnadu",(salaar)=>{
                setInbox((prevInbox) => [...prevInbox, salaar]);
            });
        };
        return ()=>{
            if(socket){
                socket.off("Cheppadu");
                socket.off("CheppalaniAnukunnadu");
            }
        }
    },[socket])
    const getCurrentPlayer=()=>{
        try{
            return room.room?.users[Object.keys(room.room?.users)[room.room?.presentState.currentPlayer]];
        }
        catch(E){
            console.log(E);
            return 123;
        }
    }
    const getPosition = (evt) => {
        const rect = canvasRef.current.getBoundingClientRect();
        let x, y;
        if (evt.touches) {
            x = evt.touches[0].clientX - rect.left;
            y = evt.touches[0].clientY - rect.top;
        } else {
            x = evt.clientX - rect.left;
            y = evt.clientY - rect.top;
        }
        return { x, y };
    };
    useEffect(() => {
        if (!socket) return;
    
        const startDrawHandler = (data) => {
            if (!data) return;
            const { x, y } = data.coords;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.beginPath(); 
            ctx.moveTo(x, y); 
        };
    
        const drawHandler = (data) => {
            if (!data) return;
            const { x, y } = data.coords;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.lineTo(x, y); 
            ctx.lineWidth = data.lineWidth;
            ctx.lineCap = "round";
            ctx.strokeStyle = data.color;
            ctx.stroke();
        };
    
        const stopDrawHandler = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.closePath();
        };
        socket.on("startDrawing", startDrawHandler);
        socket.on("drawing", drawHandler);
        socket.on("stopDrawing", stopDrawHandler);

        return () => {
            socket.off("startDrawing", startDrawHandler);
            socket.off("drawing", drawHandler);
            socket.off("stopDrawing", stopDrawHandler);
        };
    }, [socket]);
    const startDraw = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        const { x, y } = getPosition(e);
        ctx.moveTo(x, y);
        setDrawing(true);
        if (socket) {
            socket.emit("startDrawing", {coords:{x, y},roomId:room.roomId});
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { x, y } = getPosition(e);
        ctx.lineTo(x, y);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.stroke();
        if (socket) {
            socket.emit("drawing", {coords:{x, y},roomId:room.roomId,color:color,lineWidth:lineWidth});
        }
    };

    const stopDraw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.closePath();
        setDrawing(false);
        if (socket) {
            socket.emit("stopDrawing", {coords:{},roomId:room.roomId});
        }
    };
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <>
        {words.length>0?<Select array={words}></Select>:<></>}
        {room.PointsBoard?<Points></Points>:<></>}
        <div className=" w-screen h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex justify-center items-center">
            <div className="w-[85%] h-[85%] rounded bg-white/10 backdrop-blur-3xl border border-white/20 justify-between flex">
            <div className=" h-full  gap-5 flex flex-col items-center justify-center w-[60%] ">
                <div className="w-full flex justify-start ml-2 ">
                    {room.timer.isPresent&&room.timer.type==='drawing'&&<Timer></Timer>}
                </div>
                <div className="flex gap-0.5 items-center relative justify-center">
                {
                    room.word.split(" ").map((f,i)=>{
                        return f.split("").map((e,i)=>{
                            if(e=='_'){
                                if(i===f.length-1)
                                return <h1 className=" rounded border-black  p-0.5 font-extrabold text-xl">{e}{i+1}</h1>
                                else 
                                return <h1 className=" rounded border-black  p-0.5 font-extrabold text-xl">{e}</h1>
                            }
                            else if(i===f.length-1){
                                return <h1 className=" rounded border-black  p-0 font-semibold">{e}&nbsp;&nbsp; </h1>
                            }
                            else{
                            return <h1 className=" rounded border-black  p-0 font-semibold">{e}</h1>
                        }
                        })
                    })
                }
                </div>
            <div className="relative">
                { 
                (!(room.profile?.id===getCurrentPlayer().id))&&room.room?.presentState?.gameState==="choosing"?
                <h1 className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"><span className="font-extrabold">{getCurrentPlayer().userName}</span> is choosing a word</h1>:<></>
                }
            <canvas
                ref={canvasRef}
                width={"400px"}
                height={"400px"}
                className={`border border-black `}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
                >
            </canvas>
            </div>
            <div className="flex gap-3 items-center justify-center">
            <input
             type="color" placeholder="Pick a Color" onChange={(e)=>{setColor(e.target.value)}}></input>
            <button onClick={clearCanvas}>
                <FaTrash className="mr-2 cursor-pointer" />
            </button>
            <select placeholder="Pick your brush size" className="bg-white/10 backdrop-blur-2xl border border-white/10 p-2 cursor-pointer outline-0 rounded" onChange={(e)=>setLineWidth(e.target.value)}>
                <option className="text" value={3}>Light
                </option>
                <option value={15} className="text-xl">Medium</option>
                <option value={70} className="text-2xl">Bold</option>
            </select>
            </div>
            </div>
            <Inbox event={"Guess"} socket={socket} inbox={inbox}></Inbox>
            </div>
        </div>
    </>
    );
};

export default DrawingBoard;