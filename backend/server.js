// const express = require("express")   // To use express by importing, you need to put ""type": "module"" in package.json
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";


const app = express();
const PORT= process.env.PORT || 5000;

dotenv.config();

app.use(express.json());  // to parse json
app.use(cookieParser()); // to parse cookies
app.use("/api/auth",authRoutes);    //Middlewares
app.use("/api/messages",messageRoutes); 

// app.get("/", (req,res)=>{
//     //root route https:localhost:5000/
//     res.send("Hello World!!!!");
// });

app.listen (PORT,() => {
    connectToMongoDB() ;
    console.log(`Server is running on port ${PORT}`);
});
   