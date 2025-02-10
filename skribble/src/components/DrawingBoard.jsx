import { useContext, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { SocketContext } from "../store/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { roomActions } from "../store/room";
import Select from "./Select";

const DrawingBoard = () => {
    const dis = useDispatch();
    const room = useSelector(store => store.room);
    const canvasRef = useRef();
    const [isDrawing, setDrawing] = useState(false);
    const [color,setColor]=useState("#000000");
    const socket = useContext(SocketContext);
    const words=useSelector(store=>store.words);
    const [lineWidth,setLineWidth]=useState(3);
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
        {words.length>0?<Select array={words}></Select>:<></>}<div className="w-screen h-screen flex justify-center items-center">
            <canvas
                ref={canvasRef}
                width={"400px"}
                height={"400px"}
                className="border border-black"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
                >
            </canvas>
            <div className="flex flex-col gap-1 items-center justify-center">
            <input
             type="color" placeholder="Pick a Color" onChange={(e)=>{setColor(e.target.value)}}></input>
            <button onClick={clearCanvas}>
                <FaTrash className="mr-2 cursor-pointer" />
            </button>
            <select placeholder="Pick your brush size" className="bg-gray-400 cursor-pointer outline-0 rounded" onChange={(e)=>setLineWidth(e.target.value)}>
                <option className="text" value={3}>Light
                </option>
                <option value={15} className="text-xl">Medium</option>
                <option value={70} className="text-2xl">Bold</option>
            </select>
            </div>
        </div>
    </>
    );
};

export default DrawingBoard;