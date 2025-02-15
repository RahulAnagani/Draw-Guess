import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Timer=()=>{
    const room=useSelector(store=>store.room);
    const target=room.timer.target-Date.now();
    const [time,setTime]=useState(target>=0?target:0);
    useEffect(()=>{
        const timer=setInterval(()=>{
                setTime((prev)=>{
                if(prev<=1000){
                clearInterval(timer);
                return 0;
            }
                return prev-1000;
            })
        },1000);
    },[]);    
    const format=(ms)=>{
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
    }    
    return (<>
    <span className="font-bold text-2xl border p-2 border-black font-mono">
        {format(time)}
</span>

    </>);
}
export default Timer;