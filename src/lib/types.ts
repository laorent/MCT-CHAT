import type { Part } from '@google/generative-ai';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  // This will be a data URI for the image
  image?: string; 
}

export interface ChatRequest {
  messages: Message[];
}

export type History = {
  role: 'user' | 'model';
  parts: Part[];
}
