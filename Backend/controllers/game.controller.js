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
    const room=Territories.getRooms[Nibandhana.roomId];
    if(!room){
        socket.emit("error",{msg:"Room does'nt exist",status:false,thing:""});
    }
    else if(room.roomOwner.id!==socket.id){
        socket.emit("error",{msg:"Unable to make changes in the settings!",status:false});
    }
    else{
        switch(Nibandhana.settings?.type){
            case "Aatagaallu":
                room.settings.players=Nibandhana.settings.Enti;
                break;
                case "TIMING":
                room.settings.drawTime=Nibandhana.settings.Enti;
                break;
                case "Aatalu":
                    room.settings.rounds=Nibandhana.settings.Enti;                    
                    break;
        }
        const {word,...rooma}=room;
        io.to(Nibandhana.roomId).emit("settingsChange",{room:rooma})
    }
}

module.exports.startGame=({roomId,socket,io})=>{
    const room=Territories.getRooms[roomId];
    if(!room){
        socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else if(room.roomOwner.id!==socket.id){
        socket.emit("error",{msg:"Cannot make decisions",status:false,thing:"OWNERSHIP"});
    }
    else if(Object.keys(room.users).length<2){
        socket.emit("error",{msg:"Cannot start game with 1 player",status:false,thing:"Capacity"});
    }
    else{
        room.presentState.gameState="started";
        room.presentState.currentRound=1;
        room.presentState.currentPlayer=0;
        const {word,...rooma}=room;
        io.to(roomId).emit("gameStarted",{room:rooma});
        startTurn(roomId,io)
    }
};

module.exports.wordChoosen=({roomId,padam,io})=>{
    const room=Territories.getRooms[roomId];
    if(!room){
        // socket.emit("error",{msg:"Room is not found",status:false,thing:"Room Error"});
    }
    else{
        const currPlayer=room.presentState.currentPlayer;
        const pam=getCurrentPlayer(roomId,currPlayer);
        if(!pam){
            socket.emit("error",{msg:"Not your turn",status:false,thing:"Turn"});
        }
        else{
            const currPlayer=room.presentState.currentPlayer;
            const currentPlayer=getCurrentPlayer(roomId,currPlayer);
            clearTimeout(allTimers.get(roomId));
            allTimers.delete(roomId);
            room.presentState.gameState="drawing";
            room.word=padam.toLowerCase();
            const dashed=dashIt(padam);
            const {word,...rooma}=room;
            io.to(currentPlayer.id).emit("setWord",{data:room.word,room:rooma});
            io.except(pam.id).to(roomId).emit("setWord",{data:dashed,room:rooma});
            const bro=setTimeout(()=>{
                    room.presentState.currentPlayer++;
                    startTurn(roomId,io);
            },room.settings.drawTime*1000);
        }
    }
}
const turnEnded=(roomId,io)=>{

}
const startTurn=(roomId,io)=>{
    const room=Territories.getRooms[roomId];
    if(!room){
        return;
    }
    else if(Object.keys(room.users).length<2)return;
    else{  
        if(room.presentState.currentPlayer+1>Object.keys(room.users).length){
            room.presentState.currentRound++;
            room.presentState.currentPlayer=0;
        }
        if(room.presentState.currentRound>room.settings.rounds){
            io.to(roomId).emit("GameEnded",{data:"MG"});
        }
        const currentPlayer=getCurrentPlayer(roomId,room.presentState.currentPlayer);
        const words=getThreeWords();
        console.log
        io.to(currentPlayer.id).emit("Enchuko",{data:words});
        room.presentState.gameState="choosing";
        const {word,...rooma}=room;
        io.to(roomId).emit("settingsChange",{room:rooma});
        const hehe=setTimeout(()=>{
            const randomIndex = Math.floor(Math.random() * 3);
            module.exports.wordChoosen({roomId,io,socket:currentPlayer.id,padam:words[randomIndex]})
        },10000);
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
