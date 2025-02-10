const Territories={}
const {v4:uuidv4}=require("uuid");
const player={
    guessed:false,
    userName:null,
    Avatar:null,
    guessedAt:null,
    id:null,
    score:0
}
const Khansaar={
    roomOwner:{userName:"",id:null},
    users:{},
    settings:{
        players:3,
        drawTime:80,
        rounds:3,
        onlyCustomWords:false,
        customWords:[]
    },
    presentState:{
        currentRound:0,
        drawingData:null,
        word:"",
        currentPlayer:0,
        gameState:"notStarted"
    }
};
module.exports.createRoom=(varadha,socket)=>{
            const Kadiyam=uuidv4();
            socket.join(Kadiyam);
            const profile={...player};
            profile.userName=varadha.userName;
            profile.Avatar=varadha.Avatar?varadha.Avatar:null;
            profile.id=socket.id;
            const raisaar = JSON.parse(JSON.stringify(Khansaar));
            raisaar.roomOwner={userName:varadha.userName,id:socket.id}
            raisaar.users=[profile];
            raisaar.presentState.gameState="waiting"
            Territories[Kadiyam]=raisaar;
            console.log(`room with id ${Kadiyam} is created by ${varadha.userName} with id: ${socket.id}`);
            socket.emit('roomCreated',{profile:profile,roomId:Kadiyam,room:Territories[Kadiyam]});
};

module.exports.joinRoom=(Deva,socket,io)=>{
    const {userName,roomId}=Deva;
    if(!Territories[roomId]){
        socket.emit("error",{msg:"Room does'nt exist",status:false,thing:"Room Id"});
    }
    else if(Territories[roomId].users.length>=10){
        socket.emit("error",{msg:"Room is full",status:false,thing:"Join"})
    }
    else{
                const profile={...player};
                profile.userName=Deva.userName;
                profile.Avatar=Deva.Avatar?Deva.Avatar:null;
                profile.id=socket.id;
                socket.join(roomId);
                Territories[roomId].users.push(profile);
                console.log(`user with id ${roomId} is joined to the room ${roomId}`);
                io.to(roomId).except(socket.id).emit("userJoined",{room:Territories[roomId]});
                socket.emit("success",{room:Territories[roomId],profile:profile})
            }
}
module.exports.exitRoom=(socket,io,)=>{
    console.log(`user with id ${socket.id} is disconnected.`);
    for(const room in Territories){
        const ekroom=room;
        const userIndex=Territories[ekroom].users?.findIndex((user)=>user.id===socket.id);
        if(userIndex!==-1){
            const deltedUser=Territories[ekroom].users.splice(userIndex,1);
            console.log(`user with ${socket.id} is removed from the room with id ${ekroom}`);
            io.to(ekroom).emit("userLeft",{
                room:Territories[ekroom] 
            });
            if(Territories[ekroom].users.length===0){
                delete Territories[ekroom];
                console.log(`room with id ${ekroom} is deleted`);
            }
        }
    }
}
module.exports.getRooms=Territories