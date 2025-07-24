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

    // Format conversation for Cohere
    const conversation = messages
      .map(m => (m.role === 'user' ? 'User: ' : 'MindMate: ') + m.content)
      .join('\n') + '\nMindMate:';

    // Make request to Cohere API
    const response = await co.chat({
      model: 'command-xlarge-nightly',
      message: conversation,
      max_tokens: 100,
      temperature: 0.7,
    });

    console.log('🧠 Cohere Response:', JSON.stringify(response, null, 2));

    // ✅ Correct structure based on your log
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
