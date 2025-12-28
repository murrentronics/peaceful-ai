import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-peaceful flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">AI Assistant</span>
            </div>
          </div>
        </div>
      </header>
      <ChatInterface />
    </div>
  );
};

export default Chat;
