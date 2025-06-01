import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.route.js";
import promtRoutes from "./routes/promt.route.js";

const app=express()

app.use(bodyParser.json())
app.use(cookieParser())


config({path:".env"})

//for photo upload


app.use(cors({
    
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization"],

}))

mongoose.connect(
    process.env.MONGO_URL,
    {
        dbName:"DeepSeek_Ai"
    },

).then(()=>console.log("Mongoose Connected")).catch((err)=>console.log(err))

// defining routes

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai", promtRoutes);


const PORT= process.env.PORT
app.listen(PORT,()=>console.log("Server is running"))

