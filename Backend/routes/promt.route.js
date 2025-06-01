import express from "express";
import { sendPromt } from "../controllers/prompt.controller.js";
import userMiddleware from "../middlewares/promt.middlware.js";

const router = express.Router();

router.post("/promt",userMiddleware, sendPromt);

export default router;
