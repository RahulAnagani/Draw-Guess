import { useEffect, useState } from "react";

const Timer=({target})=>{
    const [time,setTime]=useState(target);
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
    <span className="font-bold">
    {format(time)}
    </span>
    </>);
}
export default Timer;