import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type Part,
} from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import type { Message, History, ChatRequest } from '@/lib/types';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function buildHistory(messages: Message[]): History[] {
  return messages.map((msg) => {
    const parts: Part[] = [{ text: msg.content }];
    if (msg.image) {
      const [mimeType, data] = msg.image.split(';base64,');
      parts.push({
        inlineData: {
          mimeType: mimeType.replace('data:', ''),
          data: data,
        },
      });
    }
    return {
      role: msg.role,
      parts,
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as ChatRequest;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }
    
    // The last message is the current prompt
    const lastMessage = messages.pop()!;
    
    const history = buildHistory(messages);

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      tools: [{ "googleSearch": {} }],
    });

    const chat = model.startChat({
      history,
      generationConfig,
      safetySettings,
    });

    const currentMessageParts: Part[] = [{ text: lastMessage.content }];
    if (lastMessage.image) {
        const [mimeType, data] = lastMessage.image.split(';base64,');
        currentMessageParts.push({
          inlineData: {
            mimeType: mimeType.replace('data:', ''),
            data: data,
          },
        });
    }

    const result = await chat.sendMessageStream(currentMessageParts);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          try {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          } catch (e) {
            console.error('Error processing chunk:', e);
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to get response from Gemini', details: message }, { status: 500 });
  }
}
