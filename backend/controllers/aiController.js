import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';
dotenv.config();

const co = new CohereClient({ apiKey: process.env.CO_API_KEY });

export const chatWithMindMate = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Format conversation and add instruction to guide the model
    const conversation = messages
      .map(m => (m.role === 'user' ? 'User: ' : 'MindMate: ') + m.content)
      .join('\n') +
      `\nUser: Please answer briefly and to the point, within 2-3 sentences.\nMindMate:`;

    // Request to Cohere API with precise control
    const response = await co.chat({
      model: 'command-xlarge-nightly',
      message: conversation,
      max_tokens: 80, // ⬅️ Keep it tight for short answers
      temperature: 0.4, // ⬅️ Lower temp = more focused
    });

    console.log('🧠 Cohere Response:', JSON.stringify(response, null, 2));

    if (response.text) {
      const reply = response.text.trim();
      res.json({ reply });
    } else {
      console.error('⚠️ Unexpected Cohere response format.');
      res.status(500).json({ error: 'Invalid response from Cohere API' });
    }
  } catch (error) {
    console.error('❌ Cohere API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};
