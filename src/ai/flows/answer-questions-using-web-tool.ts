'use server';
/**
 * @fileOverview An AI agent that answers questions using a web tool.
 *
 * - answerQuestionsUsingWebTool - A function that answers questions using a web tool.
 * - AnswerQuestionsUsingWebToolInput - The input type for the answerQuestionsUsingWebTool function.
 * - AnswerQuestionsUsingWebToolOutput - The return type for the answerQuestionsUsingWebTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsUsingWebToolInputSchema = z.object({
  query: z.string().describe('The question to answer using a web tool.'),
});
export type AnswerQuestionsUsingWebToolInput = z.infer<typeof AnswerQuestionsUsingWebToolInputSchema>;

const AnswerQuestionsUsingWebToolOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsUsingWebToolOutput = z.infer<typeof AnswerQuestionsUsingWebToolOutputSchema>;

export async function answerQuestionsUsingWebTool(input: AnswerQuestionsUsingWebToolInput): Promise<AnswerQuestionsUsingWebToolOutput> {
  return answerQuestionsUsingWebToolFlow(input);
}

const webSearch = ai.defineTool(
  {
    name: 'webSearch',
    description: 'Useful for searching the web to answer questions about current events or that require up-to-date information.',
    inputSchema: z.object({
      query: z.string().describe('The search query to use.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    // Replace this with actual web search implementation.
    // This is just a placeholder to demonstrate the tool.
    return `Web search results for "${input.query}": Placeholder search results. Go to example.com for more info.`;
  }
);

const answerQuestionsUsingWebToolPrompt = ai.definePrompt({
  name: 'answerQuestionsUsingWebToolPrompt',
  tools: [webSearch],
  input: {schema: AnswerQuestionsUsingWebToolInputSchema},
  output: {schema: AnswerQuestionsUsingWebToolOutputSchema},
  prompt: `You are a chatbot that answers questions using a web search tool. Use the webSearch tool to get up-to-date information.

  Answer the following question:
  {{query}}`,
});

const answerQuestionsUsingWebToolFlow = ai.defineFlow(
  {
    name: 'answerQuestionsUsingWebToolFlow',
    inputSchema: AnswerQuestionsUsingWebToolInputSchema,
    outputSchema: AnswerQuestionsUsingWebToolOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionsUsingWebToolPrompt(input);
    return output!;
  }
);
