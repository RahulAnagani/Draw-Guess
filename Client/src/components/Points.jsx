import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../store/SocketProvider";

const Points = () => {
    const room = useSelector(store => store.room);
    const socket = useContext(SocketContext);
    const points=Object.values(room.room.users).sort((a,b)=>b.score - a.score)
    const dis=useDispatch();
    const handleSet=(word)=>{
        if(socket){
            socket.emit("wordChoosen",{roomId:room.roomId,padam:array[word]});
            dis(roomActions.setTimer({presence:false,timer:null}));
            dis(wordActions.removeWords());
        }
    }
    return (
        <div className="bg-[rgba(80,79,79,0.8)] z-50 absolute inset-0 w-screen h-screen gap-3 flex flex-col justify-center items-center">
            <div className="radio-inputs flex flex-col gap-5">
                {
                    points.map((e,i)=>{
                        return (
                    <label className="radio">
                    <input type="radio" name="radio" />
                    <span onClick={()=>{
                        handleSet(0)
                    }}  className="name">{e.userName}-{e.score}</span>
                    </label>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Points;