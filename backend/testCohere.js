import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';
dotenv.config();

console.log('COHERE_API_KEY:', process.env.COHERE_API_KEY);

const co = new CohereClient({ apiKey: 'VALasChJtOCglDn0wUdMehKY1GQGoSiFRj81uVyO' });

async function test() {
  try {
    const response = await co.generate({
      model: 'command-xlarge-nightly',
      prompt: 'Hello world',
      max_tokens: 10,
    });
    console.log('Cohere response:', response.generations[0].text);
  } catch (error) {
    console.error('Cohere error:', error);
  }
}

test();
