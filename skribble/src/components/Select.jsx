import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../store/SocketProvider";
import { wordActions } from "../store/words";
import { roomActions } from "../store/room";

const Select = ({array}) => {
    const room = useSelector(store => store.room);
    const socket = useContext(SocketContext);   
    const dis=useDispatch();
    const handleSet=(word)=>{
        if(socket){
            socket.emit("wordChoosen",{roomId:room.roomId,padam:array[word]});
            dis(wordActions.removeWords());
        }
    }
    return (
        <div className="bg-[rgba(80,79,79,0.8)] z-50 absolute inset-0 w-screen h-screen flex justify-center items-center">
            <div className="radio-inputs flex gap-5">
                <label className="radio">
                    <input type="radio" name="radio" />
                    <span onClick={()=>{
                        handleSet(0)
                    }}  className="name">{array[0]}</span>
                </label>
                <label className="radio">
                    <input type="radio" name="radio" />
                    <span  onClick={()=>{
                        handleSet(1)
                    }} className="name">{array[1]}</span>
                </label>
                <label className="radio">
                    <input type="radio" name="radio" />
                    <span onClick={()=>{
                        handleSet(2)
                    }}  className="name">{array[2]}</span>
                </label>
            </div>

        </div>
    )
}
export default Select;