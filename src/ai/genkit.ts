import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const ai = genkit({
  plugins: [googleAI()],
  model: `googleai/${modelName}`,
});
