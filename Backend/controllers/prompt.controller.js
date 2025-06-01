import OpenAI from "openai";
import { Promt } from "../models/prompt.model.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});
export const sendPromt = async (req, res) => {
  //jo bhi content bheje ga user
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Promt content is required" });
  }

  try {
    // save user promt
    const userPromt = await Promt.create({
      userId,
      role: "user",
      content,
    });
    const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content:content 
          }
        ] 
      });


    //answer from deepseek save
    const aiContent = completion.choices[0].message.content;

    // save assistant promt


    //user ke record and response save
    const aiMessage = await Promt.create({
      userId,
      role: "assistant",
      content: aiContent,
    });
    //tou front end main bhi repy naam se ayega
    return res.status(200).json({ reply: aiContent });
  } catch (error) {
    console.log("Error in Promt: ", error);
    return res
      .status(500)
      .json({ error: "Something went wrong with the AI response" });
  }
};
