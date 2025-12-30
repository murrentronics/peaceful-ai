import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type DashboardStats = {
  totalProjects: number;
  aiGenerations: number;
  loading: boolean;
};

export function useDashboardStats(userId: string | undefined) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    aiGenerations: 0,
    loading: true,
  });

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    try {
      // Get total projects count
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Get total AI messages (assistant role = AI generations)
      const { count: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'assistant');

      if (projectError || messageError) {
        console.error('Error fetching stats:', projectError || messageError);
        return;
      }

      setStats({
        totalProjects: projectCount || 0,
        aiGenerations: messageCount || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId, fetchStats]);

  return { stats, refetch: fetchStats };
}
