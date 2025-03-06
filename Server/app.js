const express=require("express");
const cors=require("cors");
const app=express();
const dotenv=require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Fcuk u")  
})
module.exports=app;