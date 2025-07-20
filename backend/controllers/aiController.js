import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithMindMate = async (req, res) => {
  try {
    let { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Insert system message to set AI persona
    const systemMessage = {
      role: 'system',
      content: 'You are MindMate, a compassionate Islamic emotional support assistant. Respond kindly and include Quranic advice when appropriate.',
    };

    messages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};
