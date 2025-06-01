import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.route.js";
import promtRoutes from "./routes/promt.route.js";
import cors from 'cors'; // Import cors once

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

config({ path: ".env" });

// Configure CORS
const corsOptions = {
    origin: 'https://deepseek-clone-pi-five.vercel.app', // Replace with your frontend's Vercel URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // Use cors with the configured options

mongoose.connect(
    process.env.MONGO_URL,
    {
        dbName: "DeepSeek_Ai"
    },
).then(() => console.log("Mongoose Connected")).catch((err) => console.log(err));

// defining routes

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai", promtRoutes);

const PORT = process.env.PORT || 1000; // Use process.env.PORT or a default
app.listen(PORT, () => console.log("Server is running"));