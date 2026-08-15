import express from "express";
import multer from "multer";
import { agent } from "../controllers/agent.controller.js";

const router = express.Router();
const upload = multer();

router.post("/chat", upload.single("file"), agent);

export default router;