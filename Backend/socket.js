const {Server}=require("socket.io");
let io;
const roomController=require("./controllers/room.controller")
const gameController=require("./controllers/game.controller")
module.exports.initializeSocket=(server)=>{
    io=new Server(server,
        {
            cors:{
                origin:"*",
                methods:["GET","POST"]
            }
        }
    );
    io.on("connection",(socket)=>{
        console.log(`An user is connected with socket id : ${socket.id}`);
        socket.on("drawing",(varadha)=>{
            io.to(varadha.roomId).emit("drawing",varadha);
        })
        socket.on("startDrawing",(varadha)=>{
            io.to(varadha.roomId).emit("startDrawing",varadha);
        })
        socket.on("stopDrawing",(varadha)=>{
            io.to(varadha.roomId).emit("stopDrawing",varadha);
        })
        socket.on("createRoom",(salaar)=>roomController.createRoom(salaar,socket));
        socket.on("joinRoom",(Mannar)=>roomController.joinRoom(Mannar,socket,io));
        socket.on("sendMessage",(kissik)=>{gameController.sendMessage(kissik,io,socket)})
        socket.on("disconnect",()=>roomController.exitRoom(socket,io));
        socket.on("settingsChange",(data)=>gameController.changeSettings(data,socket,io))
        socket.on("startGame",(data)=>{gameController.startGame({roomId:data.roomId,socket,io})});
        socket.on("wordChoosen",(data)=>{gameController.wordChoosen({socket,io,roomId:data.roomId,padam:data.padam})})
    })
}
