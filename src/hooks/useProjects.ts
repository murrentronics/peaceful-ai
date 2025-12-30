import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type Project = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all projects for the user
  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load projects', variant: 'destructive' });
      return;
    }

    setProjects(data || []);
    setLoading(false);
  }, [userId, toast]);

  // Fetch messages for current project
  const fetchMessages = useCallback(async (projectId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' });
      return;
    }

    setMessages(data || []);
  }, [toast]);

  // Create a new project
  const createProject = useCallback(async (name: string = 'New Chat') => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: userId, name })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to create project', variant: 'destructive' });
      return null;
    }

    setProjects(prev => [data, ...prev]);
    setCurrentProjectId(data.id);
    setMessages([]);
    return data;
  }, [userId, toast]);

  // Delete a project
  const deleteProject = useCallback(async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
      return false;
    }

    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
      setMessages([]);
    }

    toast({ title: 'Deleted', description: 'Project deleted successfully' });
    return true;
  }, [currentProjectId, toast]);

  // Rename a project
  const renameProject = useCallback(async (projectId: string, name: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ name })
      .eq('id', projectId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to rename project', variant: 'destructive' });
      return false;
    }

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name } : p));
    return true;
  }, [toast]);

  // Add a message to current project
  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string, isFirstMessage: boolean = false) => {
    if (!currentProjectId) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({ project_id: currentProjectId, role, content })
      .select()
      .single();

    if (error) {
      console.error('Failed to save message:', error);
      return null;
    }

    setMessages(prev => [...prev, data]);
    
    // Auto-name project based on first user message
    if (isFirstMessage && role === 'user') {
      const autoName = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      await supabase
        .from('projects')
        .update({ name: autoName, updated_at: new Date().toISOString() })
        .eq('id', currentProjectId);
      
      setProjects(prev => prev.map(p => 
        p.id === currentProjectId ? { ...p, name: autoName } : p
      ));
    } else {
      // Just update updated_at
      await supabase
        .from('projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentProjectId);
    }

    return data;
  }, [currentProjectId]);

  // Update the last message (for streaming)
  const updateLastMessage = useCallback(async (messageId: string, content: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ content })
      .eq('id', messageId);

    if (error) {
      console.error('Failed to update message:', error);
    }

    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content } : m));
  }, []);

  // Select a project
  const selectProject = useCallback(async (projectId: string) => {
    setCurrentProjectId(projectId);
    await fetchMessages(projectId);
  }, [fetchMessages]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId, fetchProjects]);

  return {
    projects,
    currentProjectId,
    messages,
    loading,
    createProject,
    deleteProject,
    renameProject,
    selectProject,
    addMessage,
    updateLastMessage,
    setMessages,
  };
}
