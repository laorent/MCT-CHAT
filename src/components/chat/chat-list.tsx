"use client";

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatList({ messages, isLoading }: ChatListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage message={message} />
              {isLoading && index === messages.length - 1 && message.role === 'model' && (
                <div className="flex items-center justify-start ml-10 mt-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200 mx-1"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-300"></div>
                </div>
              )}
            </motion.div>
          ))}
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-16">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-foreground">
                         <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.002a.75.75 0 00-.366.648V16.5a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V6.65a.75.75 0 00-.366-.648L12.378 1.602zM12 7.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5zM11.25 15a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" />
                     </svg>
                 </div>
                 <h2 className="text-2xl font-semibold font-headline">Welcome to Gemini Chat</h2>
                 <p className="mt-2 max-w-sm">
                     Start a conversation, upload an image, or ask a question about anything.
                 </p>
             </div>
          )}
      </div>
    </ScrollArea>
  );
}
