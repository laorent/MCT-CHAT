import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-3', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="w-8 h-8 border">
          <AvatarFallback>
            <Bot className="w-5 h-5 text-accent" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[80%] p-3 rounded-xl shadow-sm space-y-2',
          isUser
            ? 'bg-primary/90 text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none'
        )}
      >
        {message.image && (
          <div className="relative w-full h-auto max-w-xs rounded-lg overflow-hidden border">
            <Image
              src={message.image}
              alt="User upload"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        )}
        <article className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-normal prose-a:text-accent prose-a:font-semibold hover:prose-a:text-accent/80 prose-code:font-code prose-code:bg-muted prose-code:text-foreground prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-pre:bg-card prose-pre:p-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
              pre: ({node, ...props}) => <pre {...props} className="bg-background/80 p-3 rounded-md overflow-x-auto" />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </article>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 border">
          <AvatarFallback>
            <User className="w-5 h-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
