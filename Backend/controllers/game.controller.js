const Territories=require("./room.controller");
const fs=require("fs")
const path=require("path");
const { roomActions } = require("../../skribble/src/store/room");
const pathu=path.join(__dirname,"../pspk.txt");
const allTimers=new Map();

const getThreeWords=(count=3)=>{
    const content=fs.readFileSync(pathu,"utf-8");
    const words = content.split("\n").map(word => word.trim()).filter(Boolean);
    const randomWords = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex]);
      }
    return randomWords;
}
module.exports.sendMessage=(kissik,io,socket)=>{
    const rooms=Territories.getRooms;
    if(!rooms[kissik.roomId]){
        socket.emit("error",{msg:"Room does'nt exist",status:false});
    }
    else{
        const ind=rooms[kissik.roomId].users?.findIndex((user)=>user.id===socket.id);
        if(ind===-1)
            socket.emit("error",{msg:"Not allowed to msg",status:false,thing:""});
        else{
            io.to(kissik.roomId).emit("recieveMessage",kissik.message);
        }
    }
}

module.exports.changeSettings=(Nibandhana,socket,io)=>{
    const rooms=Territories.getRooms;
    if(!rooms[Nibandhana.roomId]){
        socket.emit("error",{msg:"Room does'nt exist",status:false,thing:""});
    }
    else if(rooms[Nibandhana.roomId].roomOwner.id!==socket.id){
        socket.emit("error",{msg:"Unable to make changes in the settings!",status:false});
    }
    else{
        switch(Nibandhana.settings?.type){
            case "Aatagaallu":
                rooms[Nibandhana.roomId].settings.players=Nibandhana.settings.Enti;
                break;
                case "TIMING":
                rooms[Nibandhana.roomId].settings.drawTime=Nibandhana.settings.Enti;
                break;
                case "Aatalu":
                    rooms[Nibandhana.roomId].settings.rounds=Nibandhana.settings.Enti;                    
                    break;
        }
        io.to(Nibandhana.roomId).emit("settingsChange",{room:rooms[Nibandhana.roomId]})
    }
}

module.exports.startGame=({roomId,socket,io})=>{
    const rooms=Territories.getRooms;
    if(!rooms[roomId]){
        socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else if(rooms[roomId].roomOwner.id!==socket.id){
        socket.emit("error",{msg:"Cannot make decisions",status:false,thing:"OWNERSHIP"});
    }
    else if(rooms[roomId].users.length<2){
        socket.emit("error",{msg:"Cannot start game with 2 players",status:false,thing:"Capacity"});
    }
    else{
        rooms[roomId].presentState.currentRound=1;
        rooms[roomId].presentState.currentPlayer=0;
        io.to(roomId).emit("gameStarted",{room:rooms[roomId]});
        startTurn(roomId,io)
    }
};
module.exports.wordChoosen=({roomId,socket,io,padam})=>{
    const room=Territories.getRooms[roomId];
    if(!room){
        socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else{
        const currPlayer=room.presentState.currentPlayer;
        const pam=room.users[currPlayer];
        if(!pam){
            socket.emit("error",{msg:"Not your turn",status:false,thing:"Turn"});
        }
        else{
            room.presentState.word=padam;
            clearTimeout(allTimers.get(roomId));
            allTimers.delete(roomId);
            io.except(pam.id).to(roomId).emit("Enchadu",{data:"Neek endhuku ra"});
        }
    }
}
const startTurn=(roomId,io)=>{
    const rooms=Territories.getRooms;
    if(!rooms[roomId]){
        return;
    }
    else if(rooms[roomId].users.length<2)return;
    else{
        const currPlayer=rooms[roomId].presentState.currentPlayer;
        const id=rooms[roomId].users[currPlayer].id;
        const words=getThreeWords();
        io.to(id).emit("Enchuko",{data:words});
        const hehe=setTimeout(()=>{
            const randomIndex = Math.floor(Math.random() * 3);
            io.to(id).emit("NaaIshtam",{data:words[randomIndex]});
        },20000);
        allTimers.set(roomId,hehe);
    }
};
