import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ChatInterface />
    </div>
  );
};

export default Chat;
