import { AI_PROMPT } from "../services/ai.service.js"

export const AI_PROMPT_recives = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt  must be a string" });
  }

  const result = await AI_PROMPT(prompt);
  res.send(result);
};
