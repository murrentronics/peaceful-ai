import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Copy, Check, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { streamChatCompletion, type ChatMessage } from '@/lib/openrouter';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/hooks/useProjects';

interface ChatInterfaceProps {
  messages: Message[];
  currentProjectId: string | null;
  onAddMessage: (role: 'user' | 'assistant', content: string, isFirstMessage?: boolean) => Promise<{ id: string } | null>;
  onUpdateMessage: (id: string, content: string) => Promise<void>;
  onCreateProject: () => Promise<{ id: string } | null>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentProjectId,
  onAddMessage,
  onUpdateMessage,
  onCreateProject,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!import.meta.env.VITE_OPENROUTER_API_KEY && !localStorage.getItem('openrouter_api_key'));
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userContent = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Create project if none selected
      let projectId = currentProjectId;
      if (!projectId) {
        const project = await onCreateProject();
        if (!project) {
          setIsLoading(false);
          return;
        }
        projectId = project.id;
      }

      // Save user message (mark as first message if no existing messages)
      const isFirstMessage = messages.length === 0;
      await onAddMessage('user', userContent, isFirstMessage);

      // Prepare chat history
      const chatHistory: ChatMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      chatHistory.push({ role: 'user', content: userContent });

      let assistantContent = '';
      let assistantMessageId: string | null = null;

      await streamChatCompletion(
        chatHistory,
        async (delta) => {
          assistantContent += delta;
          setStreamingContent(assistantContent);
          
          // Create assistant message on first chunk
          if (!assistantMessageId) {
            const msg = await onAddMessage('assistant', assistantContent);
            if (msg) {
              assistantMessageId = msg.id;
              setStreamingId(msg.id);
            }
          }
        },
        async () => {
          // Final update with complete content
          if (assistantMessageId) {
            await onUpdateMessage(assistantMessageId, assistantContent);
          }
          setStreamingContent('');
          setStreamingId(null);
          setIsLoading(false);
        },
        apiKey || undefined
      );
    } catch (error) {
      setIsLoading(false);
      setStreamingContent('');
      setStreamingId(null);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response',
        variant: 'destructive',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex} className="whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </span>
        );
      }
      
      const language = match[1] || 'code';
      const code = match[2];
      
      parts.push(
        <div key={match.index} className="my-3 rounded-lg overflow-hidden border border-border/50">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 text-xs text-muted-foreground">
            <span>{language}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => handleCopy(code, `code-${match!.index}`)}
            >
              {copiedId === `code-${match!.index}` ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <pre className="p-4 overflow-x-auto bg-background/50">
            <code className="text-sm">{code}</code>
          </pre>
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <span key={lastIndex} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{content}</span>;
  };

  // Combine saved messages with streaming content
  const displayMessages = messages.map(m => 
    m.id === streamingId ? { ...m, content: streamingContent || m.content } : m
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {showApiKeyInput ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-peaceful flex items-center justify-center mb-4">
              <Key className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Enter your OpenRouter API Key</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Get a free API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-sage underline">openrouter.ai/keys</a>
            </p>
            <div className="flex gap-2 w-full max-w-md">
              <Input
                type="password"
                placeholder="sk-or-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (apiKey.trim()) {
                    localStorage.setItem('openrouter_api_key', apiKey.trim());
                    setShowApiKeyInput(false);
                    toast({ title: 'API key saved', description: 'You can now start chatting!' });
                  }
                }}
                disabled={!apiKey.trim()}
              >
                Save
              </Button>
            </div>
          </motion.div>
        ) : !currentProjectId && displayMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-peaceful flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Peaceful AI</h2>
            <p className="text-muted-foreground max-w-md">
              I'm here to help you write, debug, and understand code. Start a new chat or select one from the sidebar!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {displayMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-sage/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-sage" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 border border-border/50'
                    )}
                  >
                    {renderContent(message.content)}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && !streamingContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-sage/20 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-sage animate-spin" />
                </div>
                <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-3">
                  <span className="text-muted-foreground">Thinking...</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about code..."
            className="min-h-[52px] max-h-32 resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-auto aspect-square"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Powered by Mistral 7B via OpenRouter • Free tier
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
