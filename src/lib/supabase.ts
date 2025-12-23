import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  skills: string[];
  interests: string[];
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  job_type: string;
  location: string;
  salary_range: string;
  category: string;
  created_at: string;
}
