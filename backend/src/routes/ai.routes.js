import express from 'express'
import { AI_PROMPT_recives } from '../controllers/ai.controller.js';
const router = express.Router();

router.get("/generate-text",AI_PROMPT_recives)
    



export default router
