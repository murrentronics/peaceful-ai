import { createClient } from '@supabase/supabase-js';

// Public (anon) credentials can be safely used on the client.
// Prefer env vars when available, but fall back to the values you provided for this project.
const DEFAULT_SUPABASE_URL = 'https://qbnlenpvgrmoybltymog.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibmxlbnB2Z3Jtb3libHR5bW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzkzOTAsImV4cCI6MjA4MjUxNTM5MH0.KD-SGyH5_hJw9BtJWFrhIh6aZ1qdc8jQBGegHH834fM';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
