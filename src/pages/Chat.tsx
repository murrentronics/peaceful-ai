import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import ChatSidebar from '@/components/ChatSidebar';
import Header from '@/components/Header';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

const Chat: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    projects,
    currentProjectId,
    messages,
    createProject,
    deleteProject,
    renameProject,
    selectProject,
    addMessage,
    updateLastMessage,
  } = useProjects(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          projects={projects}
          currentProjectId={currentProjectId}
          onSelectProject={selectProject}
          onCreateProject={createProject}
          onDeleteProject={deleteProject}
          onRenameProject={renameProject}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            currentProjectId={currentProjectId}
            onAddMessage={addMessage}
            onUpdateMessage={updateLastMessage}
            onCreateProject={createProject}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
