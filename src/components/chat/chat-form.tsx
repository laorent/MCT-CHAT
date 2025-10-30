"use client";

import { useRef, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizonal, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ChatFormProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (imageDataUrl: string | null) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  imagePreview: string | null;
}

export function ChatForm({
  input,
  onInputChange,
  onImageUpload,
  onSubmit,
  isLoading,
  imagePreview,
}: ChatFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            variant: "destructive",
            title: "Image too large",
            description: "Please upload an image smaller than 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        onImageUpload(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="relative flex flex-col w-full overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring">
        {imagePreview && (
          <div className="p-2 relative group">
            <div className="relative w-24 h-24 rounded-md overflow-hidden border">
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0 w-6 h-6 rounded-full bg-black/50 text-white hover:bg-black/75"
              onClick={() => onImageUpload(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        <Textarea
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or describe an image..."
          className="min-h-[40px] w-full resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          disabled={isLoading}
          rows={1}
        />
        <div className="flex items-center p-3 pt-0">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="w-5 h-5" />
                <span className="sr-only">Attach an image</span>
            </Button>
            <Button type="submit" size="icon" className="ml-auto" disabled={isLoading || (!input.trim() && !imagePreview)}>
                <SendHorizonal className="w-5 h-5" />
                <span className="sr-only">Send message</span>
            </Button>
        </div>
      </div>
    </form>
  );
}
