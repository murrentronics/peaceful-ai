import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if credentials are not available
const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Authentication features will not work. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    // Return a minimal mock that won't crash the app
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
        signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
      },
    } as unknown as SupabaseClient;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};
