const Territories=require("./room.controller");
const fs=require("fs")
const path=require("path");
const { roomActions } = require("../../skribble/src/store/room");
const pathu=path.join(__dirname,"../pspk.txt");
const allTimers=new Map();
const crypto=require("crypto");

const dashIt=(s)=>{
    let pspk="";
    for(const i in s){
        if(s[i]==' '||s[i]=='-'){
            pspk=pspk+s[i];
        }
        else pspk=pspk+'_';
    }
    return pspk
}

const getThreeWords=(count=3)=>{
    const content=fs.readFileSync(pathu,"utf-8");
    const words = content.split("\n").map(word => word.trim()).filter(Boolean);
    const randomWords = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex].toLowerCase());
      }
    return randomWords;
}

const getCurrentPlayer=(roomId,playerNo)=>{
    if(!roomId||playerNo===undefined)return;
    else{
        const room=Territories.getRooms[roomId];
        if(!room)return;
        else{
            return room.users[Object.keys(room.users)[playerNo]]
        }
    }
}
module.exports.sendMessage=(kissik,socket,io)=>{
    const rooms=Territories.getRooms;
    if(!rooms[kissik.roomId]){
        socket.emit("error",{msg:"Room does'nt exist",status:false});
    }
    else{
        const ind=rooms[kissik.roomId].users[socket.id];
        if(!ind)
            socket.emit("error",{msg:"Not allowed to msg",status:false,thing:""});
        else{
            io.to(kissik.roomId).emit("recieveMessage",{sentBy:ind.userName,msg:kissik.message.padam});
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
        const {word,...room}=rooms[Nibandhana.roomId];
        io.to(Nibandhana.roomId).emit("settingsChange",{room:room})
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
    else if(Object.keys(rooms[roomId].users).length<2){
        socket.emit("error",{msg:"Cannot start game with 1 player",status:false,thing:"Capacity"});
    }
    else{
        rooms[roomId].presentState.gameState="started";
        rooms[roomId].presentState.currentRound=1;
        rooms[roomId].presentState.currentPlayer=0;
        const {word,...room}=rooms[roomId];
        io.to(roomId).emit("gameStarted",{room:room});
        startTurn(roomId,io)
    }
};
module.exports.wordChoosen=({roomId,socket,padam,io})=>{
    const room=Territories.getRooms[roomId];
    if(!room){
        socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else{
        const currPlayer=room.presentState.currentPlayer;
        const pam=getCurrentPlayer(roomId,currPlayer);
        if(!pam){
            socket.emit("error",{msg:"Not your turn",status:false,thing:"Turn"});
        }
        else{
            clearTimeout(allTimers.get(roomId));
            allTimers.delete(roomId);
            room.presentState.gameState="drawing";
            room.word=padam.toLowerCase();
            const dashed=dashIt(padam);
            socket.emit("setWord",{data:room.word});
            io.except(pam.id).to(roomId).emit("setWord",{data:dashed});
            const bro=setTimeout(()=>{
                    room.presentState.currentPlayer++;
                    startTurn(roomId,io);
            },room.settings.drawTime*1000);
            // console.log(room.settings.drawTime)
        }
    }
}
const startTurn=(roomId,io)=>{
    const rooms=Territories.getRooms;
    if(!rooms[roomId]){
        return;
    }
    else if(Object.keys(rooms[roomId].users).length<2)return;
    else{
        const currPlayer=rooms[roomId].presentState.currentPlayer;
        const currentPlayer=getCurrentPlayer(roomId,currPlayer);
        const words=getThreeWords();
        io.to(currentPlayer.id).emit("Enchuko",{data:words});
        const hehe=setTimeout(()=>{
            const randomIndex = Math.floor(Math.random() * 3);
            io.to(currentPlayer.id).emit("NaaIshtam",{data:words[randomIndex]});
        },20000);
        allTimers.set(roomId,hehe);
    }
};

module.exports.guess=({roomId,socket,padam,io})=>{
    const room=Territories.getRooms[roomId];
    const currentPlayer=getCurrentPlayer(roomId,room.presentState.currentPlayer);
    if(!room){
        socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else if(room.presentState.gameState==="drawing"&&socket.id===currentPlayer.id){
        socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else{
        if(room.word===padam){
            room.users[socket.id].guessed=true;
            io.to(roomId).emit("Cheppadu",{sentBy:room.users[socket.id].userName,guess:true,msg:""});
        }
        else{
            io.to(roomId).emit("CheppalaniAnukunnadu",{sentBy:room.users[socket.id].userName,msg:padam,guess:false});
        }
    }
}