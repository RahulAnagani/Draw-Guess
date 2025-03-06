const http=require("http");
const app=require("./app");
const server=http.createServer(app);
const {initializeSocket}=require("./socket");
const port=process.env.PORT||4000;
initializeSocket(server);
server.listen(port,()=>{
    console.log(`Server is running at port ${port} i.e http://localhost:${port}`);
})