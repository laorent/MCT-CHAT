"use client";

import { useState, type FormEvent, useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ChatList } from './chat-list';
import { ChatForm } from './chat-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { InputWithLabel } from '@/components/ui/input-with-label';

// A simple check to see if a password is required by checking an env var.
// This is not secure for production apps, but fine for this demo.
const isPasswordRequired = !!process.env.NEXT_PUBLIC_ACCESS_PASSWORD_REQUIRED;

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(!isPasswordRequired);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(isPasswordRequired);
  const [accessPassword, setAccessPassword] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPasswordModalOpen) {
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    }
  }, [isPasswordModalOpen]);

  const handleImageUpload = (imageDataUrl: string | null) => {
    setImage(imageDataUrl);
  };

  const handlePasswordSubmit = () => {
    if (accessPassword) {
      // In a real app, you'd verify the password with the server here.
      // For this demo, we'll just check if it was sent and let the server validate.
      setIsPasswordModalOpen(false);
      setIsAuthenticated(true);
      toast({
        title: 'Password accepted',
        description: 'You can now start chatting.',
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsPasswordModalOpen(true);
      return;
    }
    if (!input.trim() && !image) return;
    if (isLoading) return;

    setIsLoading(true);
    const id = Date.now().toString();
    const userMessage: Message = { id, role: 'user', content: input, image: image ?? undefined };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImage(null);

    // Add bot message placeholder
    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = { id: botMessageId, role: 'model', content: '' };
    setMessages(prev => [...prev, botMessagePlaceholder]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          password: accessPassword,
        }),
      });

      if (response.status === 401) {
          setIsAuthenticated(false);
          setIsPasswordModalOpen(true);
          setAccessPassword('');
          throw new Error('Invalid password. Please try again.');
      }

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`An error occurred: ${response.status} ${errorText}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get a response from the model.",
      });
      // Remove the placeholder on error
      setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
      if (error.message.includes('password')) {
        setAccessPassword('');
        setIsPasswordModalOpen(true);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Session Cleared",
      description: "Your chat history has been cleared.",
    })
  }

  return (
    <>
      <AlertDialog open={isPasswordModalOpen && !isAuthenticated}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access Password Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the password to access this chat application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <InputWithLabel
              id="password"
              type="password"
              label="Password"
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              ref={passwordInputRef}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handlePasswordSubmit} disabled={!accessPassword}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isAuthenticated && (
        <Card className="flex flex-col h-full w-full max-w-4xl mx-auto rounded-none sm:rounded-xl sm:my-4 sm:h-[calc(100vh-2rem)] shadow-lg">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-foreground">
                        <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.002a.75.75 0 00-.366.648V16.5a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V6.65a.75.75 0 00-.366-.648L12.378 1.602zM12 7.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5zM11.25 15a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold font-headline">MCT Chat</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={clearChat} aria-label="Clear chat session">
              <Trash2 className="w-5 h-5" />
            </Button>
          </header>
          <ChatList messages={messages} isLoading={isLoading} />
          <footer className="p-4 border-t">
            <ChatForm
              input={input}
              onInputChange={(e) => setInput(e.target.value)}
              onImageUpload={handleImageUpload}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              imagePreview={image}
            />
          </footer>
        </Card>
      )}
    </>
  );
}
